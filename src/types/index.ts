export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  rating: number;
  bio: string;
  avatar: string;
  isTechnician: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Scholarship' | 'Internship' | 'Job';
  location: string;
  deadline: string;
  description: string;
  link: string;
  organization: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: 'Student' | 'Instructor' | 'Technician' | 'Mentor';
  createdAt: string;
  replies: number;
  tags: string[];
}

export interface Mentor {
  id: string;
  name: string;
  expertise: string[];
  bio: string;
  avatar: string;
  availability: string;
}
