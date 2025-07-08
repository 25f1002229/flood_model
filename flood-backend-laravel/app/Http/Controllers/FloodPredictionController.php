<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class FloodPredictionController extends Controller
{
    public function predict()
    {
        $scriptPath = base_path('flood_model/predict_flood.py');

        if (!file_exists($scriptPath)) {
            return response()->json([
                'error' => 'Prediction script not found at ' . $scriptPath
            ], 404);
        }

        $process = new Process(['python', $scriptPath]);
        $process->run();

        if (!$process->isSuccessful()) {
            return response()->json([
                'error' => 'Prediction script execution failed.',
                'details' => $process->getErrorOutput()
            ], 500);
        }

        $output = $process->getOutput();
        json_decode($output);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json([
                'error' => 'Invalid JSON output from script.',
                'raw_output' => $output
            ], 500);
        }

        return response($output, 200)
            ->header('Content-Type', 'application/json');
    }
}
