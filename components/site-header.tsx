import { SidebarTrigger } from "@/components/ui/sidebar"
import { Searcher } from "./home/searcher"

export function SiteHeader() {
  return (
    <header className="bg-[#1a1a1a] flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <SidebarTrigger className="-ml-1" />
        <div className="block xl:hidden">
          <Searcher />
        </div>
      </div>
    </header>
  )
}
