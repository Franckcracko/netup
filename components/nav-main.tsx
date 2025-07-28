"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideProps, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { FormPostModal } from "./form-post-modal"
import { useIsMobile } from "@/hooks/use-mobile"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  }[]
}) {
  const isMobile = useIsMobile()

  const [isOpenFormPost, setIsOpenFormPost] = useState(false)
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {
            !isMobile && (
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Crear publicación"
                  onClick={() => {
                    setIsOpenFormPost(true)
                  }}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <PlusCircle />
                  <span>Crear publicación</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          }
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.url}>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
      <FormPostModal
        isOpen={isOpenFormPost}
        onChangeOpen={setIsOpenFormPost}
      />
    </SidebarGroup>
  )
}
