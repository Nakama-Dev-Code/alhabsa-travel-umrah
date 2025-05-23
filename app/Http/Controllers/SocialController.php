<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

// jika mau pakai email
use Illminate\Support\Facades\Mail;
use App\Mail\WelcomeEmailWithPassword;

class SocialController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        $googleUser = Socialite::driver('google')->user();

        // Hanya cari user yang sudah ada
        $authUser = User::where('email', $googleUser->getEmail())->first();

        // Jika user tidak ditemukan, tolak login
        if (!$authUser) {
            // sebelumnya to->(route('login'))->withErrors(['email' => 'Akun Google Anda belum terdaftar.']);
            return redirect()->route('login')->with([
                'status' => 'Akun Google Anda belum terdaftar!',
            ]);
        }

        // Pastikan email sudah terverifikasi
        if ($authUser->email_verified_at === null) {
            $authUser->email_verified_at = Carbon::now();
            $authUser->save();
        }

        // Login user
        Auth::login($authUser, true);

        return redirect()->to('/dashboard');
    }

    // Jika belum terdaftar
    // public function handleGoogleCallback()
    // {
    //     $user = Socialite::driver('google')->user();

    //     // cek user sudah tersedia
    //     $authUser = User::firstOrNew(['email' => $user->getEmail()]);

    //     // cek user bila belum tersedia
    //     if (!$authUser->exist) {
    //         $temporaryPassword = $this->generateTemporaryPassword();
    //         $authUser->name = $user->getName();
    //         $authUser->password = bcrypt($temporaryPassword);
    //         $authUser->email_verified_at = Carbon::now();
    //         $authUser->save();
    //     }

    //     // Pastikan verifikasi email telah diatur
    //     if ($authUser->email_verified_at === null) {
    //         $authUser->email_verified_at = Carbon::now();
    //         $authUser->save();
    //     }

    //     // Login User
    //     Auth::login($authUser, true);

    //     return redirect()->to('/dashboard');
    // }

    // private function generateTemporaryPassword()
    // {
    //     $letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    //     $numbers = '0123456789';

    //     $password = Str::random(6, $letters);
    //     $password .= Str::random(2, $numbers); // .= php call with this (append)

    //     return $password;
    // }
}
