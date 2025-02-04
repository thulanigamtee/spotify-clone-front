import { Component, effect, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SongService } from '../../../services/song.service';
import { SongContentService } from '../../../services/song-content.service';
import { ReadSong } from '../../../services/model/song.model';
import { SmallSongCardComponent } from '../../../shared/small-song-card/small-song-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-library',
  imports: [FontAwesomeModule, SmallSongCardComponent, RouterLink],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss',
})
export class LibraryComponent {
  private songService = inject(SongService);
  private songContentService = inject(SongContentService);
  songs: ReadSong[] = [];
  isLoading = false;

  constructor() {
    effect(() => {
      if (this.songService.getAllSig().status === 'OK') {
        this.songs = this.songService.getAllSig().value!;
      }
      this.isLoading = false;
    });
  }

  ngOnInit(): void {
    this.fetchSongs();
  }
  private fetchSongs() {
    this.isLoading = true;
    this.songService.getAll();
  }
  onPlaySong(songToPlayFirst: ReadSong): void {
    this.songContentService.createNewQueue(songToPlayFirst, this.songs!);
  }
}
