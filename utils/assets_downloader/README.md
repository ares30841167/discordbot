# Assets Downloader

## Prerequisites
```
Python >= 3.7.9
```

Before start downloading the assets, please use `pip install -r requirements.txt` to install all the dependencies this downloader needed.

## Usage
1. Set the environment variable listed below first. These variables are for authenticating purposes of Minio.

```
MINIO_ACCESS_KEY=<your access key>
MINIO_SECRET_KEY=<your secret key>
```

2. Execute `python download_assets.py`, the script will download all the assets from Minio and save them to the assets folder.