import { useState } from 'react';

interface UserProfile {
  username: string;
  email: string;
  joinDate: string;
  questionsAsked: number;
  answersGiven: number;
}

const ProfilePage = () => {
  const [profile] = useState<UserProfile>({
    username: 'JohnDoe',
    email: 'john@example.com',
    joinDate: '2023-01-01',
    questionsAsked: 5,
    answersGiven: 12
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl text-gray-600">
                {profile.username[0].toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">Joined: {profile.joinDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">Questions Asked</h3>
              <p className="text-2xl font-bold text-blue-600">{profile.questionsAsked}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold">Answers Given</h3>
              <p className="text-2xl font-bold text-green-600">{profile.answersGiven}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
