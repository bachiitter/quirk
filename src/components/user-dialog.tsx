import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Icons } from "~/components/ui/icons";
import { useSignOut } from "~/context/auth";

export function UserDialog({
  name,
  email,
  imageSrc,
}: {
  name: string;
  email: string;
  imageSrc: string;
}) {
  const signOut = useSignOut();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-xl px-3">
          <div className="flex flex-shrink-0 items-center">
            <Avatar className="h-6 w-6">
              <AvatarImage src={imageSrc} alt={name} />
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium leading-none">{name}</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[345px] sm:rounded-2xl">
        <DialogHeader className="mt-2 flex items-center justify-center">
          <DialogTitle className="-m-1 text-center font-bold">
            Signed in as
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center pt-5 text-center">
          <div className="flex flex-col items-center gap-3 pb-5">
            <div className="py-5">
              <Avatar className="flex h-24 w-24 items-center justify-center ">
                <AvatarImage src={imageSrc} alt={name} />
              </Avatar>
            </div>
            <div>
              <p className="mb-1 text-lg font-medium leading-none">{name}</p>
              <p className="leading-none text-muted-foreground">{email}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-3 h-12 w-full gap-1.5 text-base"
            onClick={() => signOut()}>
            <Icons.signout width={18} className="stroke-muted-foreground" />
            <span>Log out</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
