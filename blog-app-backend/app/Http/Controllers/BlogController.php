<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\TempImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
        $blogs = Blog::orderby('created_at','DESC');
        if(!empty($request->keyword)){
            $blogs = $blogs->where('title','like','%'. $request->keyword.'%');
        }
        $blogs = $blogs->get();
        return response()->json([
            'status'=>true,
            'data'=>$blogs
        ]); 
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $validator =Validator::make($request->all(),[
            'title'=>'required|min:3',
            'author'=>'required|min:3',
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'message'=>'Tolong perbaiki errors',
                'errors'=> $validator->errors()
            ]);
        }
        $blog = new Blog();
        $blog->title = request()->title;
        $blog->author = request()->author;
        $blog->shortDesc = request()->shortDesc;
        $blog->description = request()->description;
        $blog->save();

        //save image here 
        $tempImage = TempImage::find($request->image_id);

        if($tempImage != NULL){
            $imageExtArray = explode('.',$tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time().'-'.$blog->id.'.'.$ext;
            $blog->image = $imageName;
            $blog->save();
            
            $sourcePath = public_path('uploads/temp/'.$tempImage->name);
            $destPath = public_path('uploads/temp/'.$imageName);
           
            File::copy($sourcePath,$destPath);
        }
 
        return response()->json([
            'status'=>true,
            'message'=>'Data Berhasil ditambahkan',
            'data'=> $blog 
        ]);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
       $blog =  Blog::find($id);

       if($blog == null){
            return response()->json([
                'status'=>false,
                'message'=>'Blog tidak ditemukan',
            ]);
       }

       $blog['date'] = \Carbon\Carbon::parse($blog->created_at)->format('d M, Y');

       return response()->json([
        'status'=>true,
        'data'=>$blog
    ]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $blog =  Blog::find($id);

        if($blog == null){
            return response()->json([
                'status'=>false,
                'message'=>'Blog tidak ditemukan',
            ]);
        }
        $validator =Validator::make($request->all(),[
            'title'=>'required|min:10',
            'author'=>'required|min:3',
        ]);

        if($validator->fails()){
            return response()->json([
                'status'=>false,
                'message'=>'Tolong perbaiki errors',
                'errors'=> $validator->errors()
            ]);
        }

        $blog->title = request()->title;
        $blog->author = request()->author;
        $blog->shortDesc = request()->shortDesc;
        $blog->description = request()->description;
        $blog->save();

        //save image here 
        $tempImage = TempImage::find($request->image_id);

        if($tempImage != NULL){

            File::delete(public_path('uploads/temp/'.$blog->image)) ;
            $imageExtArray = explode('.',$tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time().'-'.$blog->id.'.'.$ext;
            $blog->image = $imageName;
            $blog->save();
            
            $sourcePath = public_path('uploads/temp/'.$tempImage->name);
            $destPath = public_path('uploads/temp/'.$imageName);
           
            File::copy($sourcePath,$destPath);
        }
 
        return response()->json([
            'status'=>true,
            'message'=>'Data Berhasil diubah',
            'data'=> $blog 
        ]);


    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $blog = Blog::find($id);
        if($blog == null){
            return response()->json([
                'status'=>false,
                'message'=>'Blog tidak ditemukan', 
            ]);
            
        }

        //delete blog image first

        File::delete(public_path('uploads/temp/'.$blog->image));

        //
        $blog->delete();
        return response()->json([
            'status'=>true,
            'message'=>'Data Berhasil dihapus'
        ]);
    }
}
