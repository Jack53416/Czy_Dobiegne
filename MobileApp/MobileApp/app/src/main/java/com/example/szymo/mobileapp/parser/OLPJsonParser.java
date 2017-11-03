package com.example.szymo.mobileapp.parser;

import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by szymo on 02.11.2017.
 */

/*package*/ class OLPJsonParser
{
    OLPJsonContext parse(final String raw) throws JSONException
    {
        return new OLPJsonContext(raw);
    }

    OLPJsonArrayContext parseArray(final String raw) throws JSONException
    {
        final JSONArray array = new JSONArray(raw);
        return new OLPJsonArrayContext(array);
    }

    @Nullable
    <T> T value(@NonNull final IOLPJsonContext ctx, @NonNull final String path)
    {
        return ctx.value(transformPath(path));
    }

    void moveContext(@NonNull final OLPJsonContext ctx, @NonNull final String path) throws JSONException
    {
        ctx.move(transformPath(path));
    }

    private String[] transformPath(final String rawPath)
    {
        return rawPath.split("/");
    }

    interface IOLPJsonContext
    {
        <T> T value(final String... path);

        OLPJsonArrayContext createArrayContext(final String... path);

        boolean exists(final String... path);
    }

    /*package*/ static class OLPJsonContext implements IOLPJsonContext
    {
        protected JSONObject mRoot;
        protected JSONObject mCurrent;

        private OLPJsonContext(final String raw) throws JSONException
        {
            this(new JSONObject(raw));
        }

        private OLPJsonContext(final JSONObject obj)
        {
            mRoot = obj;
            mCurrent = mRoot;
        }

        @Nullable
        @Override
        public <T> T value(@NonNull final String... path)
        {
            JSONObject base = path[0].isEmpty() ? mRoot : mCurrent;
            if (base == null)
            {
                return null;
            }
            for (int i = 0; i < path.length; ++i)
            {
                if (path[i].isEmpty())
                {
                    continue;
                }
                if (base.has(path[i]))
                {
                    final JSONObject newObj = base.optJSONObject(path[i]);
                    if (newObj == null && i == path.length - 1)
                    {
                        if (base.isNull(path[i]))
                        {
                            return null;
                        }
                        return (T) base.opt(path[i]);
                    }
                    else
                    {
                        base = newObj;
                    }
                }
                else
                {
                    return null;
                }
            }

            return null;
        }

        protected void move(@NonNull final String... path) throws JSONException
        {
            JSONObject base = path.length == 0 || path[0].isEmpty() ? mRoot : mCurrent;
            if (base == null)
            {
                return;
            }

            for (final String pathPart : path)
            {
                if (pathPart.isEmpty())
                {
                    continue;
                }
                if (base.has(pathPart))
                {
                    base = base.getJSONObject(pathPart);
                    if (base == null)
                    {
                        return;
                    }
                }
                else
                {
                    return;
                }
            }
            mCurrent = base;
        }

        @Nullable
        @Override
        public OLPJsonArrayContext createArrayContext(@NonNull final String... path)
        {
            final JSONArray array = value(path);
            if (array == null)
            {
                return null;
            }
            return new OLPJsonArrayContext(array);
        }

        @Override
        public boolean exists(@NonNull final String... path)
        {
            return value(path) != null;
        }
    }

    /*package*/ static final class OLPJsonArrayContext implements IOLPJsonContext
    {
        private final JSONArray mArray;
        private int mIndex;

        private OLPJsonArrayContext(final JSONArray array)
        {
            mArray = array;
            mIndex = 0;
        }

        int length()
        {
            return mArray.length();
        }

        @Override
        public <T> T value(@NonNull final String... path)
        {
            if (path.length == 0 || path[0].isEmpty())
            {
                throw new IllegalStateException("Moving context/rooted path not supported in array context");
            }

            JSONObject base = mArray.optJSONObject(mIndex);
            if (base == null)
            {
                return null;
            }

            for (int i = 0; i < path.length; ++i)
            {
                if (path[i].isEmpty())
                {
                    continue;
                }
                if (base.has(path[i]))
                {
                    final JSONObject newObj = base.optJSONObject(path[i]);
                    if (newObj == null && i == path.length - 1)
                    {
                        return (T) base.opt(path[i]);
                    }
                    else if (newObj != null)
                    {
                        base = newObj;
                    }
                    else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            return null;
        }

        /**
         * returns raw object on this index (to resolve primitive-valued arrays, e.g. [1,2,3])
         *
         * @param <T>
         * @return obj
         */
        @Nullable
        public <T> T value()
        {
            return (T) mArray.opt(mIndex);
        }

        @Nullable
        @Override
        public OLPJsonArrayContext createArrayContext(final String... path)
        {
            final JSONArray array = value(path);
            if (array == null)
            {
                return null;
            }
            return new OLPJsonArrayContext(array);
        }

        @Override
        public boolean exists(final String... path)
        {
            return value(path) != null;
        }

        public void setIndex(int index)
        {
            mIndex = index;
        }
    }
}

