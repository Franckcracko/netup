import { Avatar, AvatarFallback } from "../ui/avatar"
import { Card, CardContent } from "../ui/card"

export const ProfileSectionSkeleton = () => {
  return (
    <Card className="bg-[#2d2d2d] border-gray-700 mb-4 sm:mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
          <div className="animate-pulse">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-700">
              <AvatarFallback className="bg-gray-600 text-white text-xl sm:text-2xl"></AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 w-full text-left space-y-3">
            <div className="animate-pulse space-y-2">
              <div className="h-6 w-1/3 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/4 bg-gray-600 rounded"></div>
            </div>
            <div className="space-y-1">
              <div className="h-4 w-full bg-gray-600 rounded"></div>
              <div className="h-4 w-full bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}