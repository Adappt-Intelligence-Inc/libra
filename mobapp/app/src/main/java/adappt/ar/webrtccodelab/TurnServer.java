package adappt.ar.webrtccodelab;

import retrofit2.Call;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PUT;

/**
 * Webrtc_Step3

 */

public interface TurnServer {
    @PUT("/_turn/<xyrsys_channel>")
    Call<TurnServerPojo> getIceCandidates(@Header("Authorization") String authkey);
}
