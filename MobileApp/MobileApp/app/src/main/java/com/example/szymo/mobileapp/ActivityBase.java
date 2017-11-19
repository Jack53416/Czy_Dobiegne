package com.example.szymo.mobileapp;

import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;

import com.example.szymo.mobileapp.data.AccountInfo;
import com.example.szymo.mobileapp.util.SharedPrefs;

/**
 * Created by szymo on 17.10.2017.
 */

public class ActivityBase extends AppCompatActivity  {

    protected SharedPrefs mPrefs;

    @Override
    public void onCreate(final Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        requestWindowFeature(Window.FEATURE_NO_TITLE);
//        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        if (getResources().getBoolean(R.bool.canUseLandscapeMode)) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        }
        mPrefs = new SharedPrefs(this);
    }


}
