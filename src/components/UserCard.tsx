'use client';
import { useRouter } from 'next/navigation';
import { GENDER, User_card_FIELD } from "@/constants";
import Badge, { BadgeColor } from "./Badge";
import { SingleUser } from '@/types';

export type UserCardProps = {
    user: SingleUser;
    visibleFields?: readonly User_card_FIELD[];
};

export default function UserCard({ user, visibleFields }: UserCardProps) {
    const { firstName, lastName, age, gender, image, email, username, address, company } = user;
    const router = useRouter();
    const show = (field: User_card_FIELD) => visibleFields?.includes(field);

    const handleClick = () => {
        router.push(`/users/${user.id}`);
    };
    return (
        <div className="flex items-left gap-4 bg-white shadow-sm rounded-xl p-2 hover:shadow-md transition pointer-coarse" onClick={handleClick}>
            <div className="w-14 h-14 rounded-lg bg-gray-100">
                <img className="w-full h-full object-cover rounded-lg" src={image} alt={firstName} />
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex w-full justify-between items-center">
                    {show(User_card_FIELD.FIRST_NAME) && show(User_card_FIELD.LAST_NAME) && <h3 className="font-semibold text-gray-800">{firstName ?? ''} {lastName ?? ''}</h3>}
                    {show(User_card_FIELD.AGE) && <Badge text={`Age: ${age}`} />}
                </div>
                {show(User_card_FIELD.USERNAME) && <span className="text-xs text-gray-500">@{username}</span>}
                {show(User_card_FIELD.EMAIL) && <span className="text-xs text-gray-500">{email}</span>}
                {show(User_card_FIELD.CITY) && <Badge text={address?.city || "Unknown City"} />}
                <div className="flex items-center justify-between">
                    {show(User_card_FIELD.GENDER) && <Badge className="capitalize font-semibold " text={String(gender)} color={gender === GENDER.MALE ? BadgeColor.BLUE : BadgeColor.PINK} />}
                    {show(User_card_FIELD.JOB) && <span className="text-xs text-gray-500">{company.title}</span>}
                </div>
            </div>
        </div>
    );
}