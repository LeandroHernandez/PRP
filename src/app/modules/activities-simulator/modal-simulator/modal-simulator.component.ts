import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Student} from '../../../models/student/student.model';
import {Resourcesdocum} from '../../../models/class/class.documentresources';
import {Subject} from '../../../models/class/classdocumentSubject';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {AngularFireStorage} from '@angular/fire/storage';

declare var $: any;

@Component({
  selector: 'app-modal-simulator',
  templateUrl: './modal-simulator.component.html',
  styleUrls: ['./modal-simulator.component.css']
})

export class ModalSimulatorComponent implements OnInit {

  @Input() classes: any;
  @Output() isReturn = new EventEmitter();
  unitClass: any;
  public essayId;
  public practiceId;
  public evaluationId;
  public showViewEssay = false;
  public showViewPractice = false;
  public showViewEvaluation = false;
  public isResourceVideo = false;
  public isResourceText = false;
  public isResourceFile = false;
  public isResourceUrlYoutube = false;
  public isResourceUrl = false;
  public url: SafeResourceUrl;
  public idYoutube: String;
  public resourceUrl;
  public id = '';
  loading = false;
  private player: any;

  constructor(private sanitizer: DomSanitizer,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
    $('#ModalSimulator').modal('show');
    this.unitClass = this.classes;
  }

  /**
   * Muestra las practicas de la clase segun su tipo.
   * @param resource
   */
  onShow(resource) {
    this.loading = true;
    this.showViewEssay = false;
    this.showViewPractice = false;
    this.showViewEvaluation = false;
    this.isResourceFile = false;
    this.isResourceText = false;
    this.isResourceUrl = false;
    this.isResourceVideo = false;
    this.isResourceUrlYoutube = false;

    setTimeout(() => {
      if (resource.evaluation_type === 'evaluation') {
        const url_ev = resource.evaluation_url.split('/');
        this.evaluationId = url_ev[2];
        this.showViewEvaluation = true;
      }
      if (resource.resource_type === 'url') {
        if (resource.resource_url.includes('youtube')) {
          this.isResourceUrlYoutube = true;
          this.idYoutube = resource.resource_url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{10,12})\b/)[1]
          this.resourceUrl = 'https://www.youtube.com/embed/' + this.idYoutube;
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.resourceUrl);
        } else {
          this.isResourceUrl = true;
          this.OpenPopupCenter(resource.resource_url, ' ', 1000, 600);
        }
      }
      if (resource.resource_type === 'essay') {
        const url = resource.resource_url.split('/');
        this.essayId = url[2];
        this.showViewEssay = true;
      }
      if (resource.resource_type === 'text') {
        this.showTextBook(resource.resource_url)
        this.isResourceText = true;
      }
      if (resource.resource_type === 'file') {
        this.showTextBook(resource.resource_url)
        this.isResourceFile = true
      }
      if (resource.resource_type === 'video') {
        this.isResourceVideo = true;
        this.showVideo(resource.resource_url)
      }
      if (resource.resource_type === 'practice') {
        const url = resource.resource_url.split('es/');
        const practice_id = url[1];
        this.practiceId = practice_id
        this.showViewPractice = true;
      }
      this.loading = false;
    }, 1000);

  }

  showVideo(videourl: string) {
    // this.selectedVideo = video.subject_name + ' : ' + video.title;
    this.id = videourl.replace('https://youtu.be/', '');
    this.resourceUrl = this.sanitizerUrl(videourl);
  }

  /**
   * Visualiza en un modal el libro seleccionado.
   * @param textUrl url libro seleccionado
   */
  showTextBook(textUrl) {
    if (textUrl.indexOf('gs://dydactico.appspot') > -1) {
      const book = textUrl.split('com');
      const ref = this.storage.ref(book[1]);
      ref.getDownloadURL().subscribe(downloadURL => {
        const url = downloadURL;
        this.resourceUrl = this.sanitizerUrl(url);
      });
    } else {
      this.resourceUrl = this.sanitizerUrl(textUrl);
    }
  }

  savePlayer(player) {
    this.player = player.target;
  }

  public stopVideo() {
    this.player.stopVideo();
  }

  handleSelection(event, categorySelected) {
    if (event.selected) {
      event.source.selectionList.options.toArray().forEach(element => {
        if (element.value.name != categorySelected.name) {
          element.selected = false;
        }
      });
    }
  }

  OpenPopupCenter(pageURL, title, w, h) {
    //    console.log(pageURL);
    const left = (screen.width - w) / 2;
    const top = (screen.height - h) / 4;  // for 25% - devide by 4  |  for 33% - devide by 3
    const targetWin = window.open(pageURL, title, 'toolbar=no, location=no, directories=no, status=no, ' +
        'menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  /**
   * Omite la seguridad y confía en que el valor dado sea un URL
   * @param url direccion del recurso externo
   */
  sanitizerUrl(url): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  /** cerrar modal y retornar a componente padre */
  public closeModal() {
    this.isReturn.emit(true);
  }

}
