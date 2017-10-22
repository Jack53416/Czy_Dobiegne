package com.example.szymo.mobileapp;

import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

public class ActivityMain extends ActivityBase {


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        setContentView(R.layout.activity_main);
    }

    @Override
    public void onBackPressed() {
        moveTaskToBack(true);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        Log.i(String.valueOf(this),"Creating options menu...");
        getMenuInflater().inflate(R.menu.activity_main,menu);
        final MenuItem itemAddLocalization=menu.findItem(R.id.menu_add_localization);
        if(itemAddLocalization==null){
            Log.e(String.valueOf(this),"Missing menu entries for add handling");
            return false;
        }
        return super.onCreateOptionsMenu(menu);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return true;
    }
}
