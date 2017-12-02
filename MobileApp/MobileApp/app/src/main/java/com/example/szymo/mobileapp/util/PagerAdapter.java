package com.example.szymo.mobileapp.util;

import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by szymo on 01.12.2017.
 */

public class PagerAdapter extends android.support.v4.view.PagerAdapter
{
    private final List<PagerEntry> mObjs;

    public PagerAdapter()
    {
        mObjs = new ArrayList<>();
    }

    @Override
    public int getCount()
    {
        return mObjs.size();
    }

    @Override
    public int getItemPosition(final Object object)
    {
        for (final PagerEntry entry : mObjs)
        {
            if (entry.mView.equals(object))
            {
                return mObjs.indexOf(entry);
            }
        }
        return POSITION_NONE;
    }

    @Override
    public Object instantiateItem(final ViewGroup container, final int position)
    {
        if (HasItemAt(position))
        {
            final PagerEntry entry = mObjs.get(position);
            container.addView(entry.mView);
            return entry.mView;
        }
        return null;
    }

    @Override
    public void destroyItem(final ViewGroup container, final int position, final Object object)
    {
        if (HasItemAt(position))
        {
            container.removeView(mObjs.get(position).mView);
        }
    }

    @Override
    public boolean isViewFromObject(final View view, final Object o)
    {
        return view == o;
    }

    public void Add(final PagerEntry entry)
    {
        mObjs.add(entry);
    }

    public View View(final int position)
    {
        return HasItemAt(position)
                ? mObjs.get(position).mView
                : null;
    }

    public PagerEntry Item(final int position)
    {
        return HasItemAt(position)
                ? mObjs.get(position)
                : null;
    }

    @Override
    public CharSequence getPageTitle(final int position)
    {
        return HasItemAt(position)
                ? mObjs.get(position).mTitle
                : "";
    }

    private boolean HasItemAt(final int position)
    {
        return mObjs.size() > position;
    }

    public static class PagerEntry
    {
        public View mView;
        public String mTitle;

        public PagerEntry(final View view, final String title)
        {
            mView = view;
            mTitle = title;
        }
    }
}

