"use client";
import { useUserContext } from "@/utils/user-context";
import {
  faCloud,
  faHouse,
  faSeedling,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";

function Footer() {
  const { user } = useUserContext();
  const pathName = usePathname();

  return (
    user && (
      <footer className="fixed bottom-0 left-0 right-0 shadow-md bg-background z-10 px-3 pb-4">
        <div className="flex justify-between items-center py-2">
          <Button
            color="primary"
            variant={pathName === "/" ? "flat" : "light"}
            as={Link}
            href="/"
            className="text-2xl"
            aria-label="Home"
          >
            <FontAwesomeIcon icon={faHouse} />
          </Button>
          <Button
            aria-label="Dashboard"
            as={Link}
            className="text-2xl"
            color="primary"
            href="/plants"
            variant={pathName === "/plants" ? "flat" : "light"}
          >
            <FontAwesomeIcon icon={faSeedling} />
          </Button>
          <Button
            aria-label="Weather"
            as={Link}
            className="text-2xl"
            color="primary"
            href="/weather"
            variant={pathName === "/weather" ? "flat" : "light"}
          >
            <FontAwesomeIcon icon={faCloud} />
          </Button>
          <Button
            aria-label="Profile"
            as={Link}
            className="text-2xl"
            color="primary"
            href="/profile"
            variant={pathName === "/profile" ? "flat" : "light"}
          >
            <FontAwesomeIcon icon={faUser} />
          </Button>
        </div>
      </footer>
    )
  );
}
export default Footer;
