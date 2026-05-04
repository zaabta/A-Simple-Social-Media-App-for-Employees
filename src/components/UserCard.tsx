import { GENDER } from "@/constants";
import { selectIsAuthenticated, useAppSelector } from "@/redux";
import Badge, { BadgeColor } from "./Badge";

export type UserCardProps = {
    name?: string;
    age?: number;
    gender?: GENDER;
    avatar?: string;
    email?: string;
    username?: string;
    city?: string;
    job?: string;
    onClick?: () => void;
};

export default function UserCard({ name, age, gender, avatar, email, username, city, job, onClick }: UserCardProps) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    return (
        <div className="flex items-left gap-4 bg-white shadow-sm rounded-xl p-2 hover:shadow-md transition pointer-coarse" onClick={onClick}>
            <div className="w-14 h-14 rounded-lg bg-gray-100">
                <img className="w-full h-full object-cover rounded-lg" src={avatar} alt={name} />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex w-full justify-between items-center">
                    <h3 className="font-semibold text-gray-800">{name}</h3>
                    <Badge text={`Age: ${age}`} />
                </div>
                {isAuthenticated && <span className="text-xs text-gray-500">@{username}</span>}
                {isAuthenticated && <span className="text-xs text-gray-500">{email}</span>}
                {isAuthenticated && <Badge text={city || "Unknown City"} />}
                <div className="flex items-center justify-between">
                    <Badge className="capitalize font-semibold " text={String(gender)} color={gender === GENDER.MALE ? BadgeColor.BLUE : BadgeColor.PINK} />
                    {isAuthenticated && job && <span className="text-xs text-gray-500">{job}</span>}
                </div>
            </div>
        </div>
    );
}