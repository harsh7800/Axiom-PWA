// import Pepsico from "@/public/pepsico.png";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ChevronDown, CircleUser, Home } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
const Navbar = async () => {
  return (
    <nav className="w-full flex-center justify-between px-3 sm:px-5 md:px-10 py-4 sm:py-5 bg-blue sticky top-0 z-[100]">
      <div className="flex-center divide-x-[1px] divide-[#C3C3C3] gap-2 sm:gap-3 md:gap-5">
        <div className="bg-white size-10 rounded-full"></div>

        <h2 className="semi-bold-20 text-left  capitalize pl-2 sm:pl-3 md:pl-5">
          material comparison
        </h2>
      </div>
      {/* <Image
        width={50}
        className="border-0 rounded-full bg-white p-[4px]"
        height={50}
        src={Pepsico}
        alt="pepsico"
      /> */}

      <div className="flex-center gap-2">
        <Link href="/">
          <Home size={30} color="#fff" />
        </Link>
        {/* {user && (
          <>
            <BsQuestionOctagon color="#fff" size={24} />
            <span className="relative cursor-pointer">
              <BellIcon size={25} strokeWidth={1} color="#fff" />
              <div className="w-2 h-2 rounded-full absolute -top-1 right-0 bg-white"></div>
            </span>
          </>
        )} */}
        <Popover>
          <PopoverTrigger className="hover:no-underline border-none">
            <div className="flex-center gap-1">
              <CircleUser color="#fff" strokeWidth={1.5} size={30} />
              &nbsp;
              <p className="hidden sm:block semi-bold-16 text-white">Axiom</p>
              <ChevronDown
                className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down data-[state=open]:text-states-error"
                color="#fff"
                size={20}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent className="bg-white profile-shadow p-0 mr-5">
            <div className="w-full flex gap-2 items-center pl-5 py-5">
              <CircleUser
                className="hidden sm:block"
                strokeWidth={1.2}
                size={40}
              />
              <div className="font-medium w-full">
                <h3 className="capitalize text-md semi-bold-16 text-left text-[#414042] ">
                  Axiom
                </h3>
                <p className="text-[12px] text-[#90A0B7]">Axiom@pepsico.com</p>
              </div>
            </div>

            <PopoverClose className="text-left w-full">
              {/* {(role == "manager" || role == "admin") && ( */}
              <>
                {" "}
                <Link
                  href="/admin-portal"
                  // onClick={() => router.push("/admin-portal")}
                >
                  <p className="profile-item">Admin Portal</p>
                </Link>
                <Link href="/admin-portal/admins">
                  <p
                    className="profile-item"
                    // onClick={() => router.push("/admin-portal/admins")}
                  >
                    Create Admin
                  </p>
                </Link>
              </>
              {/* )} */}
              {/* <p className="profile-item-disabled cursor-not-allowed">
            Account Settings
          </p>
          <p className="profile-item-disabled cursor-not-allowed">Need Help</p>
          <p className="profile-item-disabled cursor-not-allowed">About</p> */}
              <p
                className="profile-item-red"
                // onClick={() => Logout()}
              >
                Log Out
              </p>
            </PopoverClose>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
