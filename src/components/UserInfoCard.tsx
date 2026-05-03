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
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 flex items-center justify-center gap-6">
            {avatar && (
                <img
                    src={avatar}
                    alt={`${firstName} ${lastName}`}
                    className="w-24 h-24 border border-gray-400 rounded-full object-cover"
                />
            )}
            <div className="flex flex-col justify-center items-start gap-2">
                <div className="flex justify-center items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {firstName} {lastName}
                    </h1>
                    <Badge text={String(gender)} color={gender === GENDER.MALE ? BadgeColor.BLUE : BadgeColor.PINK} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow icon={<img src="/assets/job.svg" alt="Job" />} label="Job" value={job || "Not specified"} />
                    <InfoRow icon={<img src="/assets/profile.svg" alt="Username" />} label="Username" value={`@${username}`} />
                    <InfoRow icon={<img src="/assets/profile.svg" alt="Age" />} label="Age" value={age || "Not specified"} />
                    <InfoRow icon={<img src="/assets/email.svg" alt="Email" />} label="Email" value={email || "Not specified"} />
                </div>
            </div>
        </div>

    );
}