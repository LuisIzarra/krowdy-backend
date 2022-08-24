import { spawn } from "child_process";
import { mkdirSync, existsSync, appendFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import uuid4 from "uuid4";
import youtube from "@googleapis/youtube";
import { google } from "googleapis";
import fs from "fs";

class SonyVegasByBootcamp {
  dirVideos: string;
  dirVideos1: string;
  constructor() {
    this.dirVideos = `${__dirname.split("/").slice(0, 5).join("/")}/srcvideos`;
    this.dirVideos1 = "src/srcvideos/";
  }
  async ffmpeg(argsFfmpeg: any) {
    try {
      return new Promise((resolve, reject) => {
        const opts = { shell: true };

        console.log(
          "🚀 ~ file: sonyvegas.controller.ts ~ line 23 ~ SonyVegasByBootcamp ~ ffmpeg ~ argsFfmpeg",
          argsFfmpeg
        );
        const child = spawn("ffmpeg", argsFfmpeg, opts);

        child.stdout.on("data", (data: any) => {
          console.log(`stdout: ${data}`);
        });

        child.stderr.on("data", (data: any) => {
          console.error(`stderr: ${data}`);
        });

        child.on("close", (code: any) => {
          console.log(`child process exited with code ${code}`);
          resolve(`proceso terminado => ${code}`);
        });

        child.on("error", (code: any) => {
          reject(`proceso con errores => ${code}`);
        });

        child.on("message", (code: any) => {
          console.log(`this is message from child.on =>`, code);
        });
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: sonyvegas.controller.ts ~ line 51 ~ SonyVegasByBootcamp ~ ffmpeg ~ error",
        error
      );
    }
  }
  async cutVideo(
    nameVideo: string,
    startTime: string,
    endTime: string,
    numberCpusAvailables = 4
  ) {
    try {
      let extensionVideo = ".mp4";
      let videoSource = {
        srcVideo: `${this.dirVideos}/${nameVideo}${extensionVideo}`,
        srcVideoOutput: `${
          this.dirVideos
        }/${nameVideo}-${uuid4()}${extensionVideo}`,
      };
      // ffmpeg -y -i video_5.mp4 -threads 4 -ss 00:00:00 -to 00:00:20 -async 1 video_5_cut.mp4
      console.log(
        "🚀 ~ file: sonyvegas.controller.ts ~ line 72 ~ SonyVegasByBootcamp ~ cutVideo ~ videoSource",
        videoSource
      );
      let args = [
        "-y",
        "-i",
        videoSource?.srcVideo,
        `-threads ${numberCpusAvailables}`,
        `-ss ${startTime}`,
        `-to ${endTime}`,
        "-async 1",
        videoSource?.srcVideoOutput,
      ];

      await this.ffmpeg(args);
    } catch (error) {
      console.log(
        "🚀 ~ file: sonyvegas.controller.ts ~ line 89 ~ SonyVegasByBootcamp ~ cutVideo ~ error",
        error
      );
      throw error;
    }
  }
  async concatVideo(
    nameVideo1: string,
    nameVideo2: string,
    numberCpusAvailables = 4
  ) {
    try {
      let extensionVideo = ".mp4";
      let extensionVideoTs = ".ts";
      let nameVideo3 = "concatOut";
      let srcVideoOutput1Name = `${nameVideo1}-${uuid4()}${extensionVideoTs}`;
      let srcVideoOutput2Name = `${nameVideo2}-${uuid4()}${extensionVideoTs}`;

      let videoSource = {
        srcVideo1: `${this.dirVideos}/${nameVideo1}${extensionVideo}`,
        srcVideo2: `${this.dirVideos}/${nameVideo2}${extensionVideo}`,
        srcVideoOutput1: `${this.dirVideos}/${srcVideoOutput1Name}`,
        srcVideoOutput2: `${this.dirVideos}/${srcVideoOutput2Name}`,
        srcVideoOutput3: `${
          this.dirVideos
        }/${nameVideo3}-${uuid4()}${extensionVideo}`,
      };
      // ffmpeg -y -i video_5.mp4 -threads 4 -ss 00:00:00 -to 00:00:20 -async 1 video_5_cut.mp4
      console.log(
        "🚀 ~ file: sonyvegas.controller.ts ~ line 118 ~ SonyVegasByBootcamp ~ concatVideo ~ videoSource",
        videoSource
      );
      let args = [
        "-y",
        "-i",
        videoSource?.srcVideo1,
        `-threads ${numberCpusAvailables}`,
        `-c copy`,
        `-bsf:v h264_mp4toannexb`,
        `-f mpegts`,
        "-async 1",
        videoSource?.srcVideoOutput1,
      ];

      await this.ffmpeg(args);

      let args2 = [
        "-y",
        "-i",
        videoSource?.srcVideo2,
        `-threads ${numberCpusAvailables}`,
        `-c copy`,
        `-bsf:v h264_mp4toannexb`,
        `-f mpegts`,
        "-async 1",
        videoSource?.srcVideoOutput2,
      ];

      await this.ffmpeg(args2);

      let args3 = [
        "-y",
        `-i "concat:${this.dirVideos1}${srcVideoOutput1Name}|${this.dirVideos1}${srcVideoOutput2Name}"`,
        `-threads ${numberCpusAvailables}`,
        `-c copy`,
        "-async 1",
        videoSource?.srcVideoOutput3,
      ];

      await this.ffmpeg(args3);
      this.uploadVideo(videoSource?.srcVideoOutput3);
    } catch (error) {
      console.log(
        "🚀 ~ file: sonyvegas.controller.ts ~ line 133 ~ SonyVegasByBootcamp ~ concatVideo ~ error",
        error
      );
      throw error;
    }
  }

  async uploadVideo(uploadVideo: string, numberCpusAvailables = 4) {
    try {
      //   const client = youtube.youtube({
      //     version: "v3",
      //     auth: "AIzaSyBLHhdG3xlrLDeruHSGz7wHYzlbC4CDy4E", // specify your API key here
      //   });

      const auth = new google.auth.GoogleAuth({
        keyFile: "client_secrets.json",
        scopes: [
          "https://www.googleapis.com/auth/cloud-platform",
          "https://www.googleapis.com/auth/youtube",
          "https://www.googleapis.com/auth/youtube.force-ssl",
          "https://www.googleapis.com/auth/youtube.upload",
          "https://www.googleapis.com/auth/youtubepartner",
        ],
      });

      const youtube = google.youtube({ version: "v3", auth });

      const authClient = await auth.getClient();
      google.options({ auth: authClient });

      const res = await youtube.videos.insert({
        requestBody: {
          status: { privacyStatus: "private" },
        },
        part: ["snippet,status"],
        media: {
          body: fs.createReadStream(`${uploadVideo}`), // assume that i have a file
        },
      });
    } catch (error) {
      console.log(
        "🚀 ~ file: sonyvegas.controller.ts ~ line 203 ~ SonyVegasByBootcamp ~ uploadVideo ~ error",
        error
      );
      throw error;
    }
  }

  async cutVideos(videoSources: any[]) {
    try {
    } catch (error) {
      throw error;
    }
  }
  async joinVideos(arrVideos: any[]) {
    try {
    } catch (error) {}
  }
  async addFilterVideos(arrVideos: any[]) {
    try {
    } catch (error) {}
  }
  async addImagesToVideos(arrVideos: any[]) {
    try {
    } catch (error) {}
  }
}

export default new SonyVegasByBootcamp();
