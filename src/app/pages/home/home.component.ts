import { Component, effect, inject } from '@angular/core';
import { FavoriteSongCardComponent } from './favorite-song-card/favorite-song-card.component';
import { SongCardComponent } from './song-card/song-card.component';
import { SongService } from '../../services/song.service';
import { ToastService } from '../../services/toast.service';
import { SongContentService } from '../../services/song-content.service';
import { ReadSong } from '../../services/model/song.model';

@Component({
  selector: 'app-home',
  imports: [FavoriteSongCardComponent, SongCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private songService = inject(SongService);
  private toastService = inject(ToastService);
  private songContentService = inject(SongContentService);

  allSongs: Array<ReadSong> | undefined;
  // allSongs!: ReadSong[] | undefined;

  isLoading = false;

  constructor() {
    this.isLoading = true;
    effect(() => {
      const allSongsResponse = this.songService.getAllSig();
      if (allSongsResponse.status === 'OK') {
        this.allSongs = allSongsResponse.value;
      } else if (allSongsResponse.status === 'ERROR') {
        this.toastService.show(
          'An error occured when fetching all songs',
          'DANGER'
        );
      }
      this.isLoading = false;
    });
  }

  onPlaySong(songToPlayFirst: ReadSong) {
    this.songContentService.createNewQueue(songToPlayFirst, this.allSongs!);
  }
}
