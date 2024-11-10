"use client";

// ... (imports remain the same)

function NavSection({ title, routes, isCollapsed }: NavSectionProps) {
  const pathname = usePathname();

  if (routes.length === 0) return null;

  return (
    <div className="mb-6"> {/* Added margin bottom for section spacing */}
      {!isCollapsed && (
        <h2 className="mb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </h2>
      )}
      <div className="space-y-1"> {/* Consistent spacing between items */}
        {routes.map((route) => (
          <Tooltip key={route.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={route.href}
                className={cn(
                  "text-sm group flex w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                  "h-10 px-3", // Fixed height and padding
                  pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                  isCollapsed && "justify-center"
                )}
              >
                <div className={cn(
                  "flex items-center flex-1",
                  isCollapsed && "justify-center"
                )}>
                  <route.icon className={cn(
                    "h-5 w-5 flex-shrink-0", // Prevent icon from shrinking
                    route.color,
                    !isCollapsed && "mr-3"
                  )} />
                  {!isCollapsed && <span className="truncate">{route.label}</span>}
                </div>
              </Link>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right" className="text-white bg-gray-800">
                {route.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

function SidebarContent({ isCollapsed, onCollapse, isMobile }: SidebarContentProps) {
  return (
    <div className={cn(
      "relative h-full bg-gray-900 text-white transition-all duration-300",
      isCollapsed ? "w-[80px]" : "w-[280px]",
      !isMobile && "p-4"
    )}>
      {!isMobile && (
        <Button
          onClick={onCollapse}
          variant="ghost"
          className={cn(
            "absolute -right-4 top-7 h-7 w-7 rounded-full border bg-gray-800 p-0 hover:bg-gray-700",
            isCollapsed && "rotate-180"
          )}
        >
          <ChevronLeft className="h-4 w-4 text-white" />
        </Button>
      )}

      <Link href="/" className={cn(
        "flex items-center",
        isCollapsed ? "justify-center" : "px-3",
        "h-16 mb-6" // Fixed height and margin
      )}>
        {isCollapsed ? (
          <PlayCircle className="h-8 w-8" />
        ) : (
          <h1 className="text-2xl font-bold">StreamTracker</h1>
        )}
      </Link>

      <div className="space-y-2"> {/* Reduced space between sections */}
        <NavSection title="Main" routes={mainRoutes} isCollapsed={isCollapsed} />
        <NavSection title="Library" routes={libraryRoutes} isCollapsed={isCollapsed} />
        <NavSection title="Content" routes={contentRoutes} isCollapsed={isCollapsed} />
        <NavSection title="Insights" routes={insightRoutes} isCollapsed={isCollapsed} />
      </div>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 border-t border-gray-800",
        !isMobile && "p-4",
        isMobile && "pb-8"
      )}>
        <div className="space-y-1 pt-4"> {/* Consistent spacing */}
          {subscriptionRoutes.map((route) => (
            <Tooltip key={route.href} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm group flex w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    "h-10 px-3", // Fixed height and padding
                    route.href === usePathname() ? "text-white bg-white/10" : "text-zinc-400",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className={cn(
                    "flex items-center flex-1",
                    isCollapsed && "justify-center"
                  )}>
                    <route.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      !isCollapsed && "mr-3"
                    )} />
                    {!isCollapsed && <span className="truncate">{route.label}</span>}
                  </div>
                </Link>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="text-white bg-gray-800">
                  {route.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
        {!isCollapsed && (
          <div className="mt-6 px-3">
            <Button className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ... (rest of the file remains the same)