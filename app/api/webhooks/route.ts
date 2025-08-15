import { verifyWebhook } from '@clerk/nextjs/webhooks'
import type { UserJSON } from '@clerk/nextjs/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

interface UsernameGeneratorOptions {
  suffixLength?: number;
  maxAttempts?: number;
  includeNumbers?: boolean;
  includeLetters?: boolean;
  separator?: string;
}

/**
 * Genera un sufijo único usando timestamp y caracteres aleatorios
 */
function generateUniqueSuffix(
  length: number = 12,
  includeNumbers: boolean = true,
  includeLetters: boolean = true
): string {
  let chars = '';
  if (includeLetters) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (includeNumbers) chars += '0123456789';

  if (!chars) {
    throw new Error('Debe incluir al menos números o letras en el sufijo');
  }

  // Timestamp en base36 para mayor unicidad
  const timestamp = Date.now().toString(36);

  const randomBytes = crypto.randomBytes(Math.max(1, length - timestamp.length));

  let randomPart = '';
  for (let i = 0; i < randomBytes.length; i++) {
    randomPart += chars.charAt(randomBytes[i] % chars.length);
  }

  return timestamp + randomPart;
}

/**
 * Genera un username único verificando contra Prisma
 */
async function generateUniqueUsername(
  baseName: string,
  options: UsernameGeneratorOptions = {}
): Promise<string> {
  const {
    suffixLength = 12,
    maxAttempts = 100,
    includeNumbers = true,
    includeLetters = true,
    separator = '_'
  } = options;

  if (!baseName) {
    throw new Error('El nombre base debe contener al menos un carácter alfanumérico válido');
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const suffix = generateUniqueSuffix(suffixLength, includeNumbers, includeLetters);
    const username = `${baseName}${separator}${suffix}`;

    try {
      // Verificar si el username ya existe en la BD
      const existingUser = await prisma.user.findUnique({
        where: { username },
        select: { id: true } // Solo seleccionar id para optimizar
      });

      if (!existingUser) {
        return username;
      }
    } catch (error) {
      console.error('Error verificando username en Prisma:', error);
      // Continúa con el siguiente intento
    }
  }

  throw new Error(`No se pudo generar un nombre único después de ${maxAttempts} intentos`);
}

/**
 * Extrae el nombre base del usuario de Clerk
 */
function extractBaseNameFromClerkUser(clerkUser: UserJSON): string {
  // Prioridad: firstName > username > email
  if (clerkUser.first_name) {
    return clerkUser.first_name;
  }

  if (clerkUser.username) {
    return clerkUser.username;
  }

  if (clerkUser.email_addresses?.[0]?.email_address) {
    const email = clerkUser.email_addresses[0].email_address;
    return email.split('@')[0]; // Parte antes del @
  }

  // Fallback
  return 'user';
}

/**
 * Construye el nombre completo desde Clerk
 */
function getFullNameFromClerk(clerkUser: UserJSON): string {
  const firstName = clerkUser.first_name || '';
  const lastName = clerkUser.last_name || '';

  if (firstName && lastName) {
    return `${firstName} ${lastName}`.trim();
  }

  return firstName || lastName || clerkUser.username || 'Usuario';
}

export async function POST(req: NextRequest) {
  const evt = await verifyWebhook(req)

  const eventType = evt.type;

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      default:
        console.log(`Evento no manejado: ${eventType}`);
    }

    return new Response('Webhook received', { status: 200 })
  } catch (error) {
    console.error(`Error handling webhook ${eventType}:`, error);
    return new Response('Error verifying webhook', { status: 500 })
  }
}

/**
 * Maneja la creación de un nuevo usuario
 */
async function handleUserCreated(clerkUser: UserJSON) {
  try {
    // Extraer información básica
    const email = clerkUser.email_addresses?.[0]?.email_address;
    const fullName = getFullNameFromClerk(clerkUser);
    const baseName = extractBaseNameFromClerkUser(clerkUser);

    if (!email) {
      throw new Error('Email es requerido para crear usuario');
    }

    // Generar username único
    const username = await generateUniqueUsername(baseName, {
      suffixLength: 10,
      maxAttempts: 50,
      separator: '_'
    });

    await prisma.user.create({
      data: {
        email,
        username,
        fullName,
      },
    });
  } catch (error) {
    // Si el error es por username duplicado, intentar otra vez
    if (error instanceof Error && error.message.includes('username')) {
      console.log('Reintentando con nuevo username...');
      // Recursivamente intentar de nuevo (máximo 3 intentos)
      // Implementar lógica de retry si es necesario
    }

    throw error;
  }
}

