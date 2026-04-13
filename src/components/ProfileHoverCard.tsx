import { useAppSelector } from '@/app/hooks';
import { RootState } from '@/app/store';
import * as HoverCard from '@radix-ui/react-hover-card';
import { LogOut, Settings, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logout } from "@/features/auth/authSlice";

type MenuItemProps = {
    icon: React.ElementType;
    label: string;
    to?: string;
    onClick?: () => void;
};

function MenuItem({ icon: Icon, label, to, onClick }: MenuItemProps) {
    const baseStyles =
        "flex items-center gap-2 p-2 rounded hover:bg-slate-100 dark:hover:bg-gray-700 text-left w-full";

    if (to) {
        return (
            <Link to={to} className={baseStyles}>
                <Icon size={16} />
                <span>{label}</span>
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={baseStyles}>
            <Icon size={16} />
            <span>{label}</span>
        </button>
    );
}

function ProfileHoverCard() {
    const { user } = useAppSelector((state: RootState) => state.auth);

    const avatar = user?.avatar || "/default-avatar.png";
    const name = user?.name || "User";

    const menuItems = [
        {
            label: "Settings",
            to: "/settings",
            icon: Settings,
        },
        {
            label: "Dashboard",
            to: "/dashboard",
            icon: TrendingUp,
        },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <HoverCard.Root openDelay={200} closeDelay={100}>
            <HoverCard.Trigger asChild>
                <img
                    src={avatar}
                    alt={name}
                    className="w-8 h-8 rounded-full object-cover border-2 
                    cursor-pointer border-gray-200 dark:border-gray-700"
                />
            </HoverCard.Trigger>

            <HoverCard.Portal>
                <HoverCard.Content className="z-50 w-56 p-2 mt-4 mr-2 rounded border
                 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-300">

                    <div className="flex flex-col gap-2">

                        {/* Profile */}
                        <Link
                            to="/profile"
                            className="flex items-center gap-3 p-2 rounded
                             hover:bg-slate-100 dark:hover:bg-gray-700"
                        >
                            <img
                                src={avatar}
                                alt={name}
                                className="w-8 h-8 rounded-full object-cover
                                 border border-gray-200 dark:border-gray-700"
                            />
                            <div>
                                <p className="text-sm font-medium">{name}</p>
                                <p className="text-xs text-gray-500">View profile</p>
                            </div>
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700" />

                        {/* Menu Items */}
                        {menuItems.map((item) => (
                            <MenuItem key={item.label} {...item} />
                        ))}

                        {/* Logout */}
                        <MenuItem
                            icon={LogOut}
                            label="Logout"
                            onClick={handleLogout}
                        />

                    </div>
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
}

export default ProfileHoverCard