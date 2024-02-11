package adappt.ar.webrtccodelab;


import android.os.AsyncTask;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Timer;
import java.util.TimerTask;

public class HTTPSignalling {

    private static final String TAG = "HTTPSignalling";


    public class HTTPGet extends AsyncTask<String, Void, String> {

        private String textView;

        public HTTPGet(String textView) {
            this.textView = textView;
        }


        @Override
        protected String doInBackground(String... strings) {

            try {
                URL url = new URL(strings[0]);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();


                InputStream stream = new BufferedInputStream(urlConnection.getInputStream());

                int code = urlConnection.getResponseCode();
                if (code == 200) {

                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(stream));
                    StringBuilder builder = new StringBuilder();

                    String inputString;
                    while ((inputString = bufferedReader.readLine()) != null) {
                        builder.append(inputString);
                    }

                    JSONObject topLevel = new JSONObject(builder.toString());

                    if (topLevel != null) {
                        // depending on what type of message we get, we'll handle it differently
                        // this is the "glue" that allows two peers to establish a connection.
                        Log.e(TAG, builder.toString());

                        String type = topLevel.getString("type");

                    }


                }
                urlConnection.disconnect();
            } catch (IOException | JSONException e) {
                e.printStackTrace();
                Log.e(TAG, e.toString());
            }
            return "weather";
        }

        @Override
        protected void onPostExecute(String temp) {
            textView = temp;

            Log.e(TAG, textView);
        }
    }




    public class HTTPpost extends AsyncTask<String, Void, String> {

        private String textView;

        public HTTPpost(String textView) {
            this.textView = textView;
        }


        @Override
        protected String doInBackground(String... strings) {

            HttpURLConnection urlConnection = null;

            try {
                URL url = new URL(strings[0]);
                urlConnection = (HttpURLConnection) url.openConnection();

                InputStream stream = new BufferedInputStream(urlConnection.getInputStream());

                urlConnection = (HttpURLConnection) url.openConnection();
                urlConnection.setRequestProperty("Content-Type", "application/json");
                urlConnection.setRequestMethod("POST");
                urlConnection.setDoOutput(true);
                urlConnection.setDoInput(true);
                urlConnection.setChunkedStreamingMode(0);

                OutputStream out = new BufferedOutputStream(urlConnection.getOutputStream());
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                        out, "UTF-8"));
                writer.write(strings[1]);
                writer.flush();

                int code = urlConnection.getResponseCode();
                if (code !=  201) {
                    throw new IOException("Invalid response from server: " + code);
                }

                BufferedReader rd = new BufferedReader(new InputStreamReader(
                        urlConnection.getInputStream()));
                String line;
                while ((line = rd.readLine()) != null) {
                    Log.i("data", line);
                }
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                if (urlConnection != null) {
                    urlConnection.disconnect();
                }
            }

            return null;
        }
        //}

//        @Override
//        protected void onPostExecute(String temp) {
//            textView = temp;
//
//            Log.e(TAG, textView);
//        }

    }



    private final Timer timer = new Timer();

    private final TimerTask tickTask = new TimerTask() {
        @Override
        public void run() {
            tick();
        }
    };


    public void tick() {

        String units = "/data/user1";
        String url = String.format("http://192.168.0.19:3000%s",units);

        String textView = "test";
        new HTTPGet(textView).execute(url);

    }



    public void startCapture(int width, int height, int framerate) {
        timer.schedule(tickTask, 0, 1000 / framerate);
    }

    public void stopCapture() throws InterruptedException {
        timer.cancel();
    }


}