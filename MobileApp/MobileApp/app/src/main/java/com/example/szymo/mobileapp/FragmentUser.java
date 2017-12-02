package com.example.szymo.mobileapp;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.example.szymo.mobileapp.View.LoginView;
import com.example.szymo.mobileapp.View.RegisterView;
import com.example.szymo.mobileapp.util.PagerAdapter;

/**
 * Created by szymo on 01.12.2017.
 */

public class FragmentUser extends FragmentBase {


    private TabLayout mTabs;
    private ViewPager mPager;
    private PagerAdapter mAdapter;

    @Override
    protected View createView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        final View inflated = inflater.inflate(R.layout.fragment_user, container, false);
        setHasOptionsMenu(true);
        mTabs = (TabLayout) inflated.findViewById(R.id.services_tabs);
        mPager = (ViewPager) inflated.findViewById(R.id.services_pager);
        return inflated;
    }

    @Override
    public void onActivityCreated(@Nullable final Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        final Context ctx = getContext();
        mAdapter = new PagerAdapter();
        mAdapter.Add(new PagerAdapter.PagerEntry(new LoginView(getActivity()),ctx.getString(R.string.sign_in) ));
        mAdapter.Add(new PagerAdapter.PagerEntry(new RegisterView(getActivity()),ctx.getString(R.string.regisetr) ));
        //hookChildrenCallback();
        mPager.setAdapter(mAdapter);
        mTabs.setupWithViewPager(mPager);
       // onAccountInfoChanged(new AccountInfo(mPrefs));
    }
}
