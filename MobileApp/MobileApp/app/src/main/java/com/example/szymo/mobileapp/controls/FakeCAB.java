package com.example.szymo.mobileapp.controls;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.example.szymo.mobileapp.R;
import com.example.szymo.mobileapp.util.DimenUtil;

/**
 * Created by szymo on 22.10.2017.
 */
public class FakeCAB extends RelativeLayout
{
    private OnClickListener mBackListener;
    private ViewGroup mActionsFrame;
    private TextView mTitle;
    private float mActionBarSize;

    public FakeCAB(final Context context)
    {
        super(context);
    }

    public FakeCAB(final Context context, final AttributeSet attrs)
    {
        super(context, attrs);
    }

    public FakeCAB(final Context context, final AttributeSet attrs, final int defStyleAttr)
    {
        super(context, attrs, defStyleAttr);
    }

    public void init()
    {
        findViewById(R.id.main_fake_cab_back).setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(final View v)
            {
                hide(true);
                if (mBackListener != null)
                {
                    mBackListener.onClick(v);
                }
            }
        });
        hide(false);
        mActionsFrame = (ViewGroup) findViewById(R.id.main_fake_cab_actions);
        mTitle = (TextView) findViewById(R.id.main_fake_cab_text);

        TypedArray ta = getContext().obtainStyledAttributes(new int[] {R.attr.actionBarSize});
        mActionBarSize = ta.getDimension(0, 0.0f);
        ta.recycle();
    }

    public void addAction(final View v)
    {
        RelativeLayout.LayoutParams lp = new LayoutParams((int) mActionBarSize, (int) mActionBarSize);
        lp.addRule(RelativeLayout.CENTER_VERTICAL, -1);
        v.setLayoutParams(lp);
        final int pad = (int) DimenUtil.ConvertDpToPixels(getResources(), 15);
        v.setPadding(pad, pad, pad, pad);
        mActionsFrame.addView(v);
    }

    public void updateTitle(final String title)
    {
        mTitle.setText(title);
    }

    public void reset()
    {
        mActionsFrame.removeAllViews();
        hide(false);
    }

    public void hide(final boolean animate) // no anim for now
    {
        setVisibility(View.GONE);
    }

    public void show()
    {
        setVisibility(View.VISIBLE);
    }

    public void setBackListener(final OnClickListener listener)
    {
        mBackListener = listener;
    }
}

