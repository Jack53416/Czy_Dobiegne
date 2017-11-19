package com.example.szymo.mobileapp;

import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.NavigationView;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;

import com.example.szymo.mobileapp.controls.FakeCAB;
import com.example.szymo.mobileapp.net.GoogleComunication;
import com.example.szymo.mobileapp.net.ServerComunication;

public class ActivityMain extends ActivityBase implements IActivityAccess,NavigationView.OnNavigationItemSelectedListener {

    private FakeCAB mFakeCAB;
    private Toolbar mToolbar;
    private NavigationView mNavigationView;
    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private int mPreviousDrawerLockMode = DrawerLayout.LOCK_MODE_UNLOCKED;
    private View mProgress;
    public ServerComunication mServerComunication;
    public GoogleComunication mgoogleComunication;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mToolbar = (Toolbar) findViewById(R.id.toolbar);


        setContentView(R.layout.activity_main);
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);
        initFakeCAB();
        initComunity();

        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (mDrawerLayout != null)
        {
            mToggle = new ActionBarDrawerToggle(this, mDrawerLayout, R.string.drawer_open,R.string.drawer_close );
            mDrawerLayout.addDrawerListener(mToggle);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setHomeButtonEnabled(true);
        }
        mNavigationView = (NavigationView) findViewById(R.id.nav_view);
        mNavigationView.setNavigationItemSelectedListener(this);
        mNavigationView.setCheckedItem(R.id.nav_main);
        mProgress = findViewById(R.id.progress);
        mProgress.setVisibility(View.GONE);

        supportInvalidateOptionsMenu();

        final FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
        final FragmentMain frag = new FragmentMain();
        ft.replace(R.id.main_content, frag);
        ft.commit();

    }

    @Override
    public void onBackPressed() {

        if (mDrawerLayout != null && mDrawerLayout.isDrawerOpen(GravityCompat.START))
        {
            mDrawerLayout.closeDrawer(GravityCompat.START);
            return;
        }
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

        itemAddLocalization.setIcon(R.drawable.ic_location);
        return super.onCreateOptionsMenu(menu);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (mToggle != null && mPreviousDrawerLockMode == DrawerLayout.LOCK_MODE_UNLOCKED && mToggle.onOptionsItemSelected(item))
        {
            return true;
        }
        return true;
    }

    private void initFakeCAB()
    {
        mFakeCAB = (FakeCAB) findViewById(R.id.main_fake_cab);
        mFakeCAB.init();
    }
    private void initComunity(){
        mServerComunication=new ServerComunication(getBaseContext());
        mgoogleComunication=new GoogleComunication(getBaseContext());
    }
    @Override
    public FakeCAB accessCAB() {
        return mFakeCAB;
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        final int id = item.getItemId();

        mFakeCAB.reset();
        return true;
    }
    public void goToPermissionActivity()
    {
        Intent intent=new Intent(this, ActivityPermissions.class);
        startActivity(intent);
        finish();
    }
}
