import os
import subprocess
import pandas as pd
import requests

#download images from link list in csv
folder_name = "downloaded_images"
os.makedirs(folder_name, exist_ok=True)
pulps = pd.read_csv('pulp_publications1.csv')

for i, row in pulps.iterrows():
    record_name = row['Record']
    url = row['Cover Image Link']
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            image_path = os.path.join(folder_name, f"{record_name}.jpg") #save image name as internal record name so i can join the data later

            # Write the image data to a file in chunks to avoid loading it all into memory
            with open(image_path, "wb") as file:
                for chunk in response.iter_content(1024):
                    file.write(chunk)

            print(f"downloaded: {image_path}") #i need to see this
        else:
            print(f"Failed to download {url} - Status code: {response.status_code}") #chatgpt looking out for me with error message

    except Exception as e:
        print(f"Error downloading {url} - {e}") #chatgpt looking out for me with error message


folder_path = r"doanloaded_images"
output_data = []

# loop to iiterate through all images in the folder
for file_name in os.listdir(folder_path):
    # path to image
    file_path = os.path.join(folder_path, file_name)

    if os.path.isfile(file_path):
        # Run the wdv3_timm.py script for the image
        try:
            print(f"Processing {file_path}...")
         
            result = subprocess.run(
                ["python", "wdv3_timm.py", file_path], check=True, capture_output=True, text=True
            )
            
            #extract tags from output
            for line in result.stdout.splitlines():
                if line.startswith("Tags:"):
                    taglist = line.replace("Tags:", "").strip()
                    output_data.append({'image name': file_name, 'taglist': taglist})
                    print(taglist) #added this to check if the tags are actually generated properly
        except subprocess.CalledProcessError as e:
            print(f"Error processing {file_path}: {e}") #chatgpt looking out for me with error message

# save outputs to a CSV file
output_df = pd.DataFrame(output_data)
output_df.to_csv("outputs2.csv", index=False)
print("Taglist saved to outputs2.csv") #nice console mesage 
