package com.example.szymo.mobileapp.util;

import java.util.List;

/**
 * Created by szymo on 02.11.2017.
 */

public final class StringUtil
{
    private StringUtil()
    {
    }

    public static <T> String Join(final List<T> elements, final String glue)
    {
        final StringBuilder sb = new StringBuilder();
        if (elements.size() > 0)
        {
            sb.append(elements.get(0));
            if (elements.size() > 1)
            {
                for (int i = 1; i < elements.size(); ++i)
                {
                    sb.append(glue);
                    sb.append(elements.get(i));
                }
            }
        }
        return sb.toString();
    }

    public static <T> String Join(final T[] elements, final String glue)
    {
        final StringBuilder sb = new StringBuilder();
        if (elements.length > 0)
        {
            sb.append(elements[0]);
            if (elements.length > 1)
            {
                for (int i = 1; i < elements.length; ++i)
                {
                    sb.append(glue);
                    sb.append(elements[i]);
                }
            }
        }
        return sb.toString();
    }

    public static String StreamToString(final java.io.InputStream is)
    {
        final java.util.Scanner s = new java.util.Scanner(is, "UTF-8").useDelimiter("\\A");
        return s.hasNext()
                ? s.next()
                : "";
    }
}

