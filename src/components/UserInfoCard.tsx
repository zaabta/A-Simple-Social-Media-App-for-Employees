import { GENDER } from '@/constants';
import Badge, { BadgeColor } from './Badge';
import InfoRow from './InfoRow';

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
        <div className="bg-white shadow-md rounded-xl p-5 sm:p-4 flex flex-col sm:flex-row items-center sm:items-start gap-5">
            {avatar && (
                <img
                    src={avatar}
                    alt={`${firstName} ${lastName}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-gray-200 object-cover shrink-0"
                />
            )}
            <div className="flex flex-col gap-3 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {firstName} {lastName}
                    </h1>
                    <Badge
                        text={String(gender)}
                        color={gender === GENDER.MALE ? BadgeColor.BLUE : BadgeColor.PINK}
                        className="capitalize"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <InfoRow icon={<img className="w-4 h-4" src="/assets/job.svg" alt="Job" />} label="Title" value={job || 'Not specified'} />
                    <InfoRow icon={<img className="w-3.5 h-3.5" src="/assets/profile.svg" alt="Username" />} label="Username" value={<span className="text-blue-600">@{username}</span>} />
                    <InfoRow icon={<img className="w-3.5 h-3.5" src="/assets/profile.svg" alt="Age" />} label="Age" value={`${age} years old`} />
                    <InfoRow icon={<img className="w-4 h-4" src="/assets/email.svg" alt="Email" />} label="Email" value={<span className="text-blue-600 break-all">{email || 'Not specified'}</span>} />
                </div>
            </div>
        </div>
    );
}