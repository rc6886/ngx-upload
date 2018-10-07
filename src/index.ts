import { isDevMode, ModuleWithProviders, NgModule, Type } from '@angular/core';

import {
    DropTargetOptions,
    LoggerOptions,
    NGX_DROP_TARGET_OPTIONS,
    ngxDropTargetOptions,
    ngxloggerOptions,
    UploadService, NGX_UPLOAD_STRATEGY, NGX_LOGGER_OPTIONS, NGX_UPLOAD_ENDPOINT, UploadEndPoint
} from './utils/configuration.model';
import { NgxDragAndDropDirective } from './directives/dropzone.directive';
import { ConsoleLogger, NgxUploadLogger, NoOpLogger } from './utils/logger.model';
import { XhrUploadService } from './services/xhrUpload.service';
import { HttpClientUploadService } from './services/httpClientUpload.service';
import { NgxThumbnailDirective } from './directives/thumbnail.directive';

export { DropTargetOptions, UploadEndPoint, LoggerOptions } from './utils/configuration.model';
export { FileItem } from './services/fileItem.model';
export { XhrUploadService } from './services/xhrUpload.service';
export { HttpClientUploadService } from './services/httpClientUpload.service';
export { UploadService } from './utils/configuration.model';

const ngxDeclarations = [
    NgxDragAndDropDirective, NgxThumbnailDirective
];

/**
 * Factory associated with internal logger
 * @param options
 * @returns {any}
 * @private
 */
export function _loggerFactory(options: LoggerOptions): NgxUploadLogger {
    const enabled = options.enabled != null ? options.enabled : isDevMode();
    if (enabled) {
        const _console: Console = typeof console === 'object' ? console : <any>{};
        const debug = options.debug != null ? options.debug : true;
        return new ConsoleLogger(_console, debug);
    }
    return new NoOpLogger();
}

@NgModule({
    declarations: [
        ...ngxDeclarations
    ],
    exports: [
        ...ngxDeclarations
    ]
})

export class NgxUploadModule {
    static forRoot(uploadStrategy?: UploadService,
                   dropTargetOptions?: DropTargetOptions,
                   uploadEndPoint?: UploadEndPoint,
                   loggerOptions?: LoggerOptions): ModuleWithProviders {

        return {
            ngModule: NgxUploadModule,
            providers: [

                {provide: NGX_LOGGER_OPTIONS, useValue: (loggerOptions) ? loggerOptions : ngxloggerOptions},
                {provide: NGX_UPLOAD_ENDPOINT, useValue: (uploadEndPoint) ? uploadEndPoint : null},
                {
                    provide: NGX_DROP_TARGET_OPTIONS,
                    useValue: (dropTargetOptions) ? dropTargetOptions : ngxDropTargetOptions
                },
                {provide: NGX_UPLOAD_STRATEGY, useValue: (uploadStrategy) ? uploadStrategy : HttpClientUploadService},
                {
                    provide: NgxUploadLogger,
                    useFactory: _loggerFactory,
                    deps: [NGX_LOGGER_OPTIONS]
                },
                XhrUploadService,
                HttpClientUploadService
            ]
        }

    };
}
