<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Candidate;

class CandidateSeeder extends Seeder
{
    public function run(): void
    {
        $candidates = [
            [
                'name' => 'Sarah Johnson',
                'description' => 'A passionate advocate for education and community development.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Sarah',
            ],
            [
                'name' => 'Maria Garcia',
                'description' => 'Dedicated to promoting cultural diversity and inclusion.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Maria',
            ],
            [
                'name' => 'Emily Chen',
                'description' => 'Environmental activist working towards sustainable solutions.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Emily',
            ],
            [
                'name' => 'Aisha Patel',
                'description' => 'Healthcare professional committed to improving public health.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Aisha',
            ],
            [
                'name' => 'Jessica Williams',
                'description' => 'Technology enthusiast promoting digital literacy.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Jessica',
            ],
            [
                'name' => 'Sophia Rodriguez',
                'description' => 'Artist and creative advocate for arts education.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Sophia',
            ],
            [
                'name' => 'Isabella Thompson',
                'description' => 'Business leader focused on women empowerment.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Isabella',
            ],
            [
                'name' => 'Olivia Davis',
                'description' => 'Sports advocate promoting fitness and wellness.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Olivia',
            ],
            [
                'name' => 'Ava Martinez',
                'description' => 'Social worker dedicated to helping vulnerable communities.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Ava',
            ],
            [
                'name' => 'Mia Anderson',
                'description' => 'Scientist working on innovative research projects.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Mia',
            ],
            [
                'name' => 'Charlotte Taylor',
                'description' => 'Journalist committed to truth and transparency.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Charlotte',
            ],
            [
                'name' => 'Amelia Brown',
                'description' => 'Chef promoting healthy eating and food sustainability.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Amelia',
            ],
            [
                'name' => 'Harper Wilson',
                'description' => 'Law student advocating for justice and equality.',
                'image' => 'https://via.placeholder.com/150x200/4A90E2/FFFFFF?text=Harper',
            ],
        ];

        foreach ($candidates as $candidate) {
            Candidate::create($candidate);
        }
    }
} 