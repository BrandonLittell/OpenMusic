var searchQuery = "";
var currentSong;

$(document).ready(function() {

    // Setup Soundcloud link
    SC.initialize({
        client_id: keys.soundcloudID,
        redirect_uri: "/callback.html"
    });
    
    // Prevent 'Enter' reload on search submision
    $('#music_search_form').submit(function(e) {
        e.preventDefault();
    });
    
    // Search on every keypress
    $('#music_search').keyup(function(key) {
        //$(this).autocomplete('close');

       searchQuery = $(this).val();
       
       // Remove any existing AJAX search result
       // READ: Probably a better way of doing this
       $('#songlist ul').remove();
       
       if(searchQuery !== "" )
       {
            querySoundcloud();
       }
       
    });
    
    // Play/Pause Event
    $('#player_play_button').click(function(e) {
       if(currentSong !== null)
       {
           if($(this).hasClass('icon-play'))
           {
                currentSong.play();
                $('#player_play_button').removeClass('icon-play').addClass('icon-pause');
           }
            else
            {
                currentSong.pause();
                $('#player_play_button').removeClass('icon-pause').addClass('icon-play');
            }
       }
    });
    
    // Volume Change Event
    $('#player_volume_slider').change( function( event ) { 
        if( currentSong !== undefined )
            currentSong.setVolume( event.target.value );
    } );
    
    
});


// Update song progress bar every 1/4 second
window.setInterval(function() {
    if(currentSong !== undefined)
    {
        var percent = currentSong.position / currentSong.duration;
        percent *= 100;
        $('#player_song_length').width(percent + '%');
    }
}, 250);

// Send a search query to SC and put results in a built songlist
var querySoundcloud = function () {
    var $list = $(document.createElement('ul'));
    $('#songlist').append($list);
    
    SC.get('/tracks', { q: searchQuery, limit: 10 }, function(tracks) {
        
        
        for( var i = 0; i < tracks.length; i++ )
        {
            $list.append(buildSong(tracks[i]));
        }
        
    });
};

// Generic play song, handles where song came from
var playSong = function(track) {
    var id = track.attr('data-id');
    $('#player_song_title').text(track.title);
    $('#player_play_button').removeClass('icon-play').addClass('icon-pause');
    playSoundcloud(id);
};

// Plays a song from Soundcloud
var playSoundcloud = function (trackID) {
    SC.stream("/tracks/" + trackID, function(sound){

        
        for( var i = 0; i < tracks.length; i++ )
        {
            $list.append(buildSong(tracks[i]));
        }
        
    });
};

/***********************************
 * Wait a second....
 ***********************************/
 // Hackathon code! Will fix this duplication later...

var playSong = function(track) {
    var id = track.attr('data-id');
    $('#player_song_title').text(track.attr('data-title'));
    $('#player_song_artist').text(track.attr('data-artist'));
    $('#player_album_art').attr( 'src', track.attr('data-album-art' ) );
    $('#player_play_button').removeClass('icon-play').addClass('icon-pause');
    $('#player_song_length').width('0%');
    playSoundcloud(id);
};

var playSoundcloud = function (trackID) {
    SC.stream("/tracks/" + trackID, function(sound){
        if(currentSong != undefined)
        {
            currentSong.stop();
        }
        currentSong = sound;
        currentSong.play();
    });
};


// Builds the display list data for a generic track
var buildSong = function(track) {
    var $song = $(document.createElement('li'));
    
    $song.addClass( 'song' ).attr( 'data-id', track.id );
    $song.attr( 'data-title', track.title );
    $song.attr( 'data-artist', track.user.username );
    console.log( "Track.artwork: " + track.artwork_url );
    $song.attr( 'data-album-art', track.artwork_url );
    $song.append(
        '<div class="row collapse">' +
            '<div class="large-1 hide-for-small columns">' + 
                '<div class="icon-play" />' +
            '</div>'+
            '<div class="small-12 large-11 columns">' +
                '<div class="row collapse">' +
                    '<div class="small-12 columns">' +
                        //'<a class="songtitle" href="' + track.permalink_url + '">' + track.title + '</a>' +
                        '<p class="songtitle">' + track.title + '</p>' +
                    '</div>' +
                '</div>' +
                '<div class="row collapse">' +
                    '<div class="small-10 columns">' +
                        //'<a class="songartist" href="' + track.user.permalink_url + '">' + track.user.username + '</a>' +
                        '<p class="songartist">' + track.user.username + '</p>' + 
                    '</div>' +
                    '<div class="small-2 columns">' +
                        //'<div class="songservice" />' +
                        //'<nbsp />' +
                        '<a class="right" href="' + track.permalink_url + '">' +
                            '<img class="songservice" src="http://developers.soundcloud.com/assets/logo_big_black.png">' +
                        '</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
    
    // Start playing the song once it has been selected
    $song.click(function(e) {
        playSong($song);
    });
    
    // Return the element to place it in the list
    return $song;
};
