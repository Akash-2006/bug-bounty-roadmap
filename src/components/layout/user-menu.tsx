import { LogOut } from "lucide-react";

import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth-store";

/** Account menu (email + sign out). Rendered only in cloud mode when signed in. */
export function UserMenu() {
  const email = useAuthStore((s) => s.email);
  const status = useAuthStore((s) => s.status);

  if (!isSupabaseConfigured || status !== "signed_in") return null;

  const initial = (email ?? "?").charAt(0).toUpperCase();

  async function signOut() {
    await supabase?.auth.signOut();
    // Reset all in-memory state cleanly for the next session.
    window.location.reload();
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="Account"
            >
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initial}
              </span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{email ?? "Account"}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" className="min-w-[12rem]">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Signed in as
          <div className="truncate font-medium text-foreground">{email}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => void signOut()}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
