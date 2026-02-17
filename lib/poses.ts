export interface PoseTemplate {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const POSE_TEMPLATES: PoseTemplate[] = [
  {
    id: 'thumbs-up',
    name: 'Thumbs Up',
    category: 'Casual',
    imageUrl: '/poses/thumbs-up.jpg',
    difficulty: 'easy',
  },
  {
    id: 'casual-walk',
    name: 'Casual Walk',
    category: 'Casual',
    imageUrl: '/poses/casual-walk.jpg',
    difficulty: 'easy',
  },
  {
    id: 'street-photo',
    name: 'Street Shot',
    category: 'Confident',
    imageUrl: '/poses/street-photo.jpg',
    difficulty: 'medium',
  },
  {
    id: 'lean-wall',
    name: 'Wall Lean',
    category: 'Relaxed',
    imageUrl: '/poses/lean-wall.jpg',
    difficulty: 'easy',
  },
  {
    id: 'classy-stand',
    name: 'Classy Stand',
    category: 'Professional',
    imageUrl: '/poses/classy-stand.jpg',
    difficulty: 'medium',
  },
  {
    id: 'fashion-pose',
    name: 'Fashion Pose',
    category: 'Confident',
    imageUrl: '/poses/fashion-pose.jpg',
    difficulty: 'medium',
  },
  {
    id: 'model-pose',
    name: 'Model Pose',
    category: 'Fun',
    imageUrl: '/poses/model-pose.jpg',
    difficulty: 'hard',
  },
  {
    id: 'pose-ideas',
    name: 'Classic Pose',
    category: 'Casual',
    imageUrl: '/poses/pose-ideas.jpg',
    difficulty: 'easy',
  },
  {
    id: 'street-style',
    name: 'Street Style',
    category: 'Confident',
    imageUrl: '/poses/street-style.jpg',
    difficulty: 'medium',
  },
  {
    id: 'casual-sit',
    name: 'Casual Sit',
    category: 'Relaxed',
    imageUrl: '/poses/casual-sit.jpg',
    difficulty: 'easy',
  },
  {
    id: 'summer-pose',
    name: 'Summer Vibes',
    category: 'Fun',
    imageUrl: '/poses/summer-pose.jpg',
    difficulty: 'easy',
  },
  {
    id: 'night-vibe',
    name: 'Night Out',
    category: 'Professional',
    imageUrl: '/poses/night-vibe.jpg',
    difficulty: 'medium',
  },
];

export function getPoseById(id: string): PoseTemplate | undefined {
  return POSE_TEMPLATES.find((p) => p.id === id);
}
