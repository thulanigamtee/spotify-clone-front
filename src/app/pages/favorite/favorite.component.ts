import { Component, effect, inject } from '@angular/core';
import { ReadSong } from '../../services/model/song.model';
import { SongService } from '../../services/song.service';
import { SongContentService } from '../../services/song-content.service';
import { FavoriteSongBtnComponent } from '../../shared/favorite-song-btn/favorite-song-btn.component';
import { SmallSongCardComponent } from '../../shared/small-song-card/small-song-card.component';

@Component({
  selector: 'app-favorite',
  imports: [FavoriteSongBtnComponent, SmallSongCardComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss',
})
export class FavoriteComponent {
  favoriteSongs: Array<ReadSong> = [];

  songService = inject(SongService);

  songContentService = inject(SongContentService);

  constructor() {
    effect(() => {
      let addOrRemoveFavoriteSongSig =
        this.songService.addOrRemoveFavoriteSongSig();
      if (addOrRemoveFavoriteSongSig.status === 'OK') {
        this.songService.fetchFavorite();
      }
    });

    effect(() => {
      let favoriteSongState = this.songService.fetchFavoriteSongSig();
      if (favoriteSongState.status === 'OK') {
        favoriteSongState.value?.forEach((song) => (song.favorite = true));
        this.favoriteSongs = favoriteSongState.value!;
      }
    });
  }

  ngOnInit(): void {
    this.songService.fetchFavorite();
  }

  onPlay(firstSong: ReadSong) {
    this.songContentService.createNewQueue(firstSong, this.favoriteSongs);
  }
}
