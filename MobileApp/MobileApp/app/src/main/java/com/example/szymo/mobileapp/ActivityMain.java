package com.example.szymo.mobileapp;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.design.widget.NavigationView;
import android.support.v4.app.FragmentTransaction;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.widget.Toolbar;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.PopupWindow;
import android.widget.TextView;

import com.example.szymo.mobileapp.controls.FakeCAB;
import com.example.szymo.mobileapp.data.AccountInfo;
import com.example.szymo.mobileapp.net.GoogleComunication;
import com.example.szymo.mobileapp.net.ServerComunication;

public class ActivityMain extends ActivityBase implements IActivityAccess, NavigationView.OnNavigationItemSelectedListener, IMainFragment {

    private FakeCAB mFakeCAB;
    private Toolbar mToolbar;
    private NavigationView mNavigationView;
    private DrawerLayout mDrawerLayout;
    private ActionBarDrawerToggle mToggle;
    private int mPreviousDrawerLockMode = DrawerLayout.LOCK_MODE_UNLOCKED;
    private View mProgress;
    public ServerComunication mServerComunication;
    public GoogleComunication mgoogleComunication;
    private AccountInfo mAccountInfo;
    private ViewGroup mCoordinator;
    private PopupWindow mAccountPopup;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mToolbar = (Toolbar) findViewById(R.id.toolbar);


        setContentView(R.layout.activity_main);
        mCoordinator = (ViewGroup) findViewById(R.id.main_coordinator);
        mToolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(mToolbar);
        initFakeCAB();
        initComunity();

        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (mDrawerLayout != null) {
            mToggle = new ActionBarDrawerToggle(this, mDrawerLayout, R.string.drawer_open, R.string.drawer_close);
            mDrawerLayout.addDrawerListener(mToggle);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setHomeButtonEnabled(true);
        }
        mNavigationView = (NavigationView) findViewById(R.id.nav_view);
        mNavigationView.setNavigationItemSelectedListener(this);
        mNavigationView.setCheckedItem(R.id.nav_map);
        mProgress = findViewById(R.id.progress);
        mProgress.setVisibility(View.GONE);

        supportInvalidateOptionsMenu();

        mAccountInfo = new AccountInfo(mPrefs);
        final FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
        final FragmentMain frag = new FragmentMain();
        ft.replace(R.id.main_content, frag);
        ft.commit();
    }

    @Override
    public void onBackPressed() {

        if (mDrawerLayout != null && mDrawerLayout.isDrawerOpen(GravityCompat.START)) {
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
    protected void onStop() {
        mAccountInfo.clear(mPrefs);
        super.onStop();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        Log.i(String.valueOf(this), "Creating options menu...");
        getMenuInflater().inflate(R.menu.activity_main, menu);
        final MenuItem itemAddLocalization = menu.findItem(R.id.menu_add_localization);
        if (itemAddLocalization == null) {
            Log.e(String.valueOf(this), "Missing menu entries for add handling");
            return false;
        }

        itemAddLocalization.setIcon(R.drawable.ic_location);
        final MenuItem itemLoginState = menu.findItem(R.id.menu_action_login_state);
        if (itemLoginState == null) {
            Log.e(String.valueOf(this), "Missing menu entries for account handling");

            return false;
        }
        itemLoginState.setIcon(determineUserConnectionIcon());
        itemLoginState.setTitle(mAccountInfo.isValid() ? R.string.connect : R.string.disconnect);

        return super.onCreateOptionsMenu(menu);
    }

    private int determineUserConnectionIcon() {
        if (mAccountInfo.isValid()) {
            return R.drawable.ic_person_green;
        }
        return R.drawable.ic_person_red;

    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        if (mToggle != null && mPreviousDrawerLockMode == DrawerLayout.LOCK_MODE_UNLOCKED && mToggle.onOptionsItemSelected(item)) {
            return true;
        }
        if (id == R.id.menu_action_login_state) {
            displayAccountWindow();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void displayAccountWindow() {
        final boolean connected = mAccountInfo.isValid();
        final View inflated =
                getLayoutInflater().inflate(connected ? R.layout.popup_account_connected : R.layout.popup_account_disconnected, mCoordinator, false);
        mAccountPopup = new PopupWindow(inflated, ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT, false);
        final Button actionBtn = (Button) inflated.findViewById(R.id.popup_account_action);
        if (connected) {
            mAccountPopup.setFocusable(true);
            ((TextView) inflated.findViewById(R.id.popup_account_login)).setText(mAccountInfo.mUserName);
            actionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    mAccountInfo.clear(mPrefs);
                    invalidateOptionsMenu();
                    mAccountPopup.dismiss();
                    displayAccountWindow();
                }
            });
        } else {
            mAccountPopup.setFocusable(true);

            actionBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    final FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
                    final FragmentUser frag = new FragmentUser();
                    ft.replace(R.id.main_content, frag);
                    ft.commit();
                    mAccountPopup.dismiss();
                }
            });

            inflated.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(final View v, final MotionEvent event) {
                    mAccountPopup.dismiss();
                    return false;
                }
            });
        }
        mAccountPopup.showAtLocation(mCoordinator, Gravity.TOP, 0, 0);

    }

    private void initFakeCAB() {
        mFakeCAB = (FakeCAB) findViewById(R.id.main_fake_cab);
        mFakeCAB.init();
    }

    private void initComunity() {
        mServerComunication = new ServerComunication(getBaseContext());
        mgoogleComunication = new GoogleComunication(getBaseContext());

    }

    @Override
    public FakeCAB accessCAB() {
        return mFakeCAB;
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        final int id = item.getItemId();

        mFakeCAB.reset();

        if (id == R.id.nav_map) {
            final FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
            final FragmentMain frag = new FragmentMain();
            ft.replace(R.id.main_content, frag);
            ft.commit();
        } else if (id == R.id.nav_user) {
            final FragmentTransaction ft = getSupportFragmentManager().beginTransaction();
            final FragmentUser frag = new FragmentUser();
            ft.replace(R.id.main_content, frag);
            ft.commit();
        }
        if (mDrawerLayout != null) {
            mDrawerLayout.closeDrawer(GravityCompat.START);
        }
        return true;
    }

    public void goToPermissionActivity() {
        Intent intent = new Intent(this, ActivityPermissions.class);
        startActivity(intent);
        finish();
    }

    public void invalidateOptionsMenu() {
        supportInvalidateOptionsMenu();
    }

    @Override
    public void onAccountInfoChanged(final AccountInfo info) {
        mAccountInfo = info;
    }

    @NonNull
    public AccountInfo getAccountInfo() {
        if (mAccountInfo != null) {
            return mAccountInfo;
        }
        return mAccountInfo = new AccountInfo();
    }
}
