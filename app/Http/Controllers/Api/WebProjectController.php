<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WebProject;
use Illuminate\Http\Request;

class WebProjectController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');
        $country = $request->query('country');

        $query = WebProject::query();

        if ($category) {
            $query->where('category', $category);
        }

        if ($country) {
            $query->where('country', $country);
        }

        $projects = $query->orderBy('created_at', 'desc')->get();

        $transformedProjects = $projects->map(function ($project) {
            return [
                'id' => $project->id,
                'category' => $project->category,
                'title' => $project->name,
                'price' => $project->estimated_cost . ' ' . $project->devise,
                'description' => $project->description,
                'time' => $project->created_at->diffForHumans(),
                'country' => $project->country,
                'country_flag' => $project->country_flag,
            ];
        });

        $categories = WebProject::select('category')->distinct()->pluck('category');
        $countries = WebProject::select('country')->distinct()->pluck('country');

        return response()->json([
            'projects' => $transformedProjects,
            'categories' => $categories,
            'countries' => $countries,
        ]);
    }
}
