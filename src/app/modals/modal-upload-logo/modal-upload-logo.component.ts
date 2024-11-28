import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ShareDataService } from "app/services/ShareData/share-data.service";
import { MatDialogRef } from "@angular/material/dialog";
import swal from "sweetalert2";

@Component({
  selector: "app-modal-upload-logo",
  templateUrl: "./modal-upload-logo.component.html",
  styleUrls: ["./modal-upload-logo.component.css"],
})
export class ModalUploadLogoComponent implements OnInit {
  fileName = " Sin factura";
  imageSrc: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  @Output() selectedFileEmitter: EventEmitter<File> = new EventEmitter();

  constructor(
    private dataShareService: ShareDataService,
    public dialogRef: MatDialogRef<ModalUploadLogoComponent>
  ) {}

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }

  onSave(): void {
    if (this.selectedFile) {
      this.dataShareService.setFile(this.selectedFile); // Enviar el archivo al servicio
      this.selectedFileEmitter.emit(this.selectedFile);
      // this.dialogRef.close(this.selectedFile.name); // Cerrar el modal
      this.dialogRef.close(this.selectedFile); // Cerrar el modal
    } else {
      swal({
        title: "Error",
        text: "Debe seleccionar una imagen",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-danger",
        type: "error",
      });
    }
  }
}
