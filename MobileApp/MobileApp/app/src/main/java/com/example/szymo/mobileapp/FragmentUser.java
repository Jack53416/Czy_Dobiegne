package com.example.szymo.mobileapp;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/**
 * Created by szymo on 01.12.2017.
 */

public class FragmentUser extends FragmentBase {
    @Override
    protected View createView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        final View inflated = inflater.inflate(R.layout.fragment_user, container, false);
        return inflated;
    }
}
