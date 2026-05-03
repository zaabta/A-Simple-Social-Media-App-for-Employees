import { GENDER } from "@/constants";
import Badge, { BadgeColor } from "./Badge";
import InfoRow from "./InfoRow";

export type UserInfoCardProps = {
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    job?: string;
    avatar?: string;
    gender?: GENDER;
    age?: number;
};

export default function UserInfoCard({ firstName, lastName, username, email, job, avatar, gender, age }: UserInfoCardProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 flex sm:flex-row flex-col items-center justify-center gap-6">
            {avatar && (
                <img
                    src={avatar}
                    alt={`${firstName} ${lastName}`}
                    className="w-20 h-20 border border-gray-400 rounded-full object-cover"
                />
            )}
            <div className="flex flex-col justify-center items-start gap-2">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {firstName} {lastName}
                    </h1>
                    <Badge text={String(gender)} color={gender === GENDER.MALE ? BadgeColor.BLUE : BadgeColor.PINK} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <InfoRow icon={<img className="w-4 h-4" src="/assets/job.svg" alt="Job" />} label="Job" value={job || "Not specified"} />
                    <InfoRow icon={<img className="w-3.5 h-3.5" src="/assets/profile.svg" alt="Username" />} label="Username" value={<span className="text-sm text-blue-600">@{username}</span>} />
                    <InfoRow icon={<img className="w-3.5 h-3.5" src="/assets/profile.svg" alt="Age" />} label="Age" value={age || "Not specified"} />
                    <InfoRow icon={<img className="w-5 h-5" src="/assets/email.svg" alt="Email" />} label="Email" value={<span className="text-sm text-blue-600">{email || "Not specified"}</span>} />
                </div>
            </div>
        </div>

    );
}