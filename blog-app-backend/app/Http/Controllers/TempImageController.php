<?php

namespace App\Http\Controllers;

use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TempImageController extends Controller
{
    //
    public function store(Request $request){

        $validator  = Validator::make($request->all(),[
            'image'=>'required|image'
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'message'=>'Tolong perbaikin error ini',
                'errors'=>$validator->errors()
            ]);
        }

            $image = $request->image;
            $ext = $image->getClientOriginalExtension();
            $imageName = time().'.'.$ext;

            //store image info in database
            $tempImage = new TempImage();
            $tempImage->name = $imageName;
            $tempImage->save();

            //Move image to temp directory

            $image->move(public_path('uploads/temp'),$imageName);

            return response()->json([
                'status'=>true,
                'message'=>'Gambar sukses di upload',
                'image'=>$tempImage
            ]);
    }
}
