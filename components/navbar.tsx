"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react";
import Image from "next/image";
import { useUser } from "../hooks/useUser";
import Link from "next/link";
import { useState } from "react";

type NavLink = {
    label : string,
    href : string,
    isAdminMenu ?: boolean
}

const NavLinkConstants : NavLink[] = [
    {
        label : "ホーム",
        href : "/"
    },
    {
        label : "Dashboard",
        href : "/dashboard"
    }
]

const LinkConstants : NavLink[] = [
    {
        label : "ホーム / Home",
        href : "/"
    },
    {
        label : "ダッシュボード / Dashboard",
        href : "/dashboard"
    },
    {
        label : "ユーザー / User",
        href : "/user"
    },
    {
        label : "管理者メニュー / Admin",
        href : "/dashboard/admin",
        isAdminMenu : true
    },
    {
        label : "法的表示 / Legal",
        href : "/terms"
    }
]

export function NavigationBar() {
    const [Open, OpenChange] = useState<boolean>(false)
    const { data } = useUser();

    function isServerAdmin( bool : boolean | undefined ){
        if( bool === undefined ) return false;
        return bool;
    }

    return (
        <Navbar disableAnimation isMenuOpen={ Open } onMenuOpenChange={ OpenChange }>
            <NavbarBrand>
                {/*<Image className="rounded-full" src="/logo.png" height={36} width={36} alt="ロゴ" /> */}
                <Link href="/">
                    <p className="font-bold text-inherit text-2xl px-3"><span className="text-amber-500">H</span><span className="text-amber-300">SS</span> Developers</p>
                </Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex " justify="center">
                {
                    NavLinkConstants.map((link, index) => (
                        <NavbarItem key={`nav-top-${index}`}>
                                <Link color="foreground" href={`${link.href ?? "/"}`}> {link.label} </Link>
                        </NavbarItem>
                    ))
                } 
            </NavbarContent>
            <NavbarContent justify="end">
                <Link href="/user"> { (isServerAdmin(data?.serverAdmin) ? "👑" : "")+(data?.username ?? "ログインしていません")} </Link>
                <NavbarMenuToggle aria-label={Open ? "メニューを閉じる" : "メニューを開く"} />
            </NavbarContent>
            <NavbarMenu className="w-2/3 sm:w-1/2 lg:w-1/5 z-50 inset-x-auto float-right right-0 font-normal text-2xl border-l-2 border-l-yellow-100">
                {
                    LinkConstants.map((link, index) => (
                        (link.isAdminMenu && !isServerAdmin(data?.serverAdmin)) ? null :
                        <NavbarMenuItem  key={`nav-top-${index}`}>
                            <Link color="foreground" href={`${link.href ?? "/"}`} onClick={() => OpenChange( false )}> {link.label} </Link>
                        </NavbarMenuItem >
                    ))
                }
            </NavbarMenu>
        </Navbar>
    )
}

