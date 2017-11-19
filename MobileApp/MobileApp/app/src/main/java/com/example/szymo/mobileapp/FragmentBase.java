package com.example.szymo.mobileapp;

import android.app.Activity;
import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.os.IBinder;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.TextView;

import com.example.szymo.mobileapp.data.AccountInfo;
import com.example.szymo.mobileapp.net.ServerComunication;
import com.example.szymo.mobileapp.util.SharedPrefs;

/**
 * Created by szymo on 25.10.2017.
 */

public abstract class FragmentBase extends android.support.v4.app.Fragment implements IMainFragment {


    protected View mNoDataFrame;
    private AccountInfo mAccountInfo;
    protected SharedPrefs mPrefs;
    @Nullable
    @Override
    public final View onCreateView(final LayoutInflater inflater, @Nullable final ViewGroup container, @Nullable final Bundle savedInstanceState)
    {
        final View v = createView(inflater, container, savedInstanceState);
        return v;
    }

    @Override
    public void onAttach(final Context context)
    {
        super.onAttach(context);
        mPrefs = new SharedPrefs(context);
    }

    @Override
    public void onDestroyView()
    {
        super.onDestroyView();

    }

    @Override
    public final void onSaveInstanceState(final Bundle outState)
    {
        super.onSaveInstanceState(outState);
    }

    /**
     * @return true if backpress was consumed
     */
    public boolean onBackPressed()
    {
        return false;
    }

    protected abstract View createView(final LayoutInflater inflater, @Nullable final ViewGroup container, @Nullable final Bundle savedInstanceState);
    @Override
    public void onViewCreated(final View view, @Nullable final Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);

        mNoDataFrame = view.findViewById(R.id.no_data_frame);
        if (mNoDataFrame != null && mNoDataFrame instanceof TextView)
        {
            ((TextView) mNoDataFrame).setText(noDataMessageId());
        }
    }

    @Override
    public void onActivityCreated(@Nullable final Bundle savedInstanceState)
    {
        super.onActivityCreated(savedInstanceState);
        final FragmentActivity activity = getActivity();
        if (!(activity instanceof IActivityAccess))
        {
            throw new RuntimeException("Parent activity has to implement activity access");
        }


    }

    protected int noDataMessageId()
    {
        return R.string.no_data_label_default;
    }

    protected void hideKeyboard()
    {
        if (getContext() != null)
        {
            if (!(getContext() instanceof Activity))
            {
                hideKeyboardInternal(getView()); // use this view as a fallback
                return;
            }
            final Activity act = (Activity) getContext();
            View focusedView = act.getCurrentFocus();
            if (focusedView == null)
            {
                focusedView = getView();
            }
            hideKeyboardInternal(focusedView);
        }
    }

    private void hideKeyboardInternal(final View v)
    {
        if (v == null)
        {
            return;
        }
        final IBinder token = v.getWindowToken();
        if (token != null)
        {
            final InputMethodManager inputManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputManager.hideSoftInputFromWindow(token, InputMethodManager.HIDE_NOT_ALWAYS);
        }
    }

    @Override
    public void onAccountInfoChanged(AccountInfo info) {
        mAccountInfo = info;
    }
    @NonNull
    protected AccountInfo getAccountInfo()
    {
        if (mAccountInfo != null)
        {
            return mAccountInfo;
        }
        return mAccountInfo = new AccountInfo(mPrefs);
    }
}
