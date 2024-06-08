import Image from "next/image";
import { ConnectBtn } from "./connectButton";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white h-14 flex items-center">
      <div className="wrapper-container w-full">
        <div className="flex items-center  cursor-pointer gap-4">
          <Link href={"/"}>Home</Link>
          <Link href={"/swap"}>Swap</Link>
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <ConnectBtn />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
