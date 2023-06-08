import os
import shutil

from minio import Minio
from minio.error import InvalidResponseError

ENDPOINT_URL = 'minio.guanyu.dev'
ASSETS_FOLDER = '../../assets'
BUCKET_NAME = 'discordbot-assets'

def validate_env_variable():
  if os.environ.get('MINIO_ACCESS_KEY') is None:
    print('Please define MINIO_ACCESS_KEY for authenticating first!')
    exit(1)

  if os.environ.get('MINIO_SECRET_KEY') is None:
    print('Please define MINIO_SECRET_KEY for authenticating first!')
    exit(1)

def new_minio_client():
  return Minio(
            ENDPOINT_URL,
            access_key=os.environ.get('MINIO_ACCESS_KEY'),
            secret_key=os.environ.get('MINIO_SECRET_KEY')
          )

def clean_assets_folder():
  for f in os.listdir(ASSETS_FOLDER):
    shutil.rmtree(os.path.join(ASSETS_FOLDER, f))
 
def download_assets():
  client = new_minio_client()

  try:
    for item in client.list_objects(BUCKET_NAME, recursive=True):
        client.fget_object(BUCKET_NAME, item.object_name, f'{ASSETS_FOLDER}/{item.object_name}')
        print(f'{item.object_name} has been downloaded successfully...')
  except InvalidResponseError as err:
      clean_assets_folder()
      print(err)
      exit(1)

if __name__ == '__main__':
  validate_env_variable()
  clean_assets_folder()
  download_assets()