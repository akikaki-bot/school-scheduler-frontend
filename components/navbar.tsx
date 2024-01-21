import { Navbar, NavbarBrand } from "@nextui-org/react";
import Image from "next/image";



export function NavigationBar() {
    return (
        <Navbar>
            <NavbarBrand>
                <Image className="rounded-full" src="/logo.png" height={36} width={36} alt="ロゴ" />
                <p className="font-bold text-inherit text-2xl px-3"><span className="text-amber-500">H</span><span className="text-amber-300">SS</span> Developers</p>
            </NavbarBrand>
        </Navbar>
    )
}