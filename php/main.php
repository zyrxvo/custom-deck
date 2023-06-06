<?php
ini_set('pcre.jit', '0');

function loadConfig($filename) {
    $file = fopen($filename, "r") or die("Unable to open file!");
    $configfile = fread($file, filesize($filename));
    fclose($file);

    $config = json_decode($configfile, true);
    return $config;
}
function parseMD($filename) {
    $file = fopen($filename, "r") or die("Unable to open file!");
    $markdown = fread($file,filesize($filename));
    fclose($file);

    $html = preg_replace('/`([^`]+)`/u', "<code>$1</code>", $markdown);
    $html = preg_replace('/^(>[\s*]?)(.*)/um', "<blockquote>\n$2</blockquote>", $html);
    $html = preg_replace('/<\/blockquote>\n<blockquote>/u', "", $html);
    $html = preg_replace('/^(<blockquote>)?- (.*)$/um', "<ul><li>$2</li></ul>", $html);
    $html = preg_replace('/<\/ul>\n<ul>/u', "", $html);
    $html = preg_replace('/^(\d+)\. (.*)$/um', "<ol><li>$2</li></ol>", $html);
    $html = preg_replace('/<\/ol>\n<ol>/u', "", $html);
    $html = preg_replace('/^(?![#]+ )(.*)(?<!\n)$/um', '<p>$1</p>', $html);

    $html = preg_replace_callback('/^(#+)\s*([\d:]+)?\s*-?\s*(.*)/um', function ($matches) {
        $headingLevel = strlen($matches[1]);
        $time = $matches[2];
        $title = $matches[3];
        $anchorText = ($time ? "{$time} - {$title}" : $title);
        return "<h{$headingLevel} id=\"" . strtolower(str_replace(" ", "-", $title)) . "\">{$anchorText}</h{$headingLevel}>";
    }, $html);

    $html = preg_replace('/\*\*(.*?)\*\*/u', "<strong>$1</strong>", $html);
    $html = preg_replace('/\_\_(.*?)\_\_/u', "<strong>$1</strong>", $html);
    $html = preg_replace('/\*(.*?)\*/u', "<em>$1</em>", $html);
    $html = preg_replace('/\_(.*?)\_/u', "<em>$1</em>", $html);
    $html = preg_replace('/¡\[([^\]]+)\]\(([^)]+)\)/u', "<div class='centre-button'><a href='$2'><button class='button'>$1</button></a></div>", $html);
    $html = preg_replace('/!\[([^\]]+)\]\(([^)]+)\|(\d+)\)/u', "<div><img src='$2' alt='$1' style='width: $3px;' decoding='async' loading='lazy'></div>", $html);
    $html = preg_replace('/!\[([^\]]+)\]\(([^)]+)\)/u', "<img src='$2' alt='$1' decoding='async' loading='lazy'>", $html);
    $html = preg_replace('/\[([^\]]+)\]\(([^)]+)\)/u', "<a href='$2'>$1</a>", $html);

    return $html;
}

function insertMD($filename) {
    echo parseMD($filename);
}

function loadPosts($filelist) {
    echo $filelist;
    echo "<br>" . __FILE__ . "<br>";
    $file = fopen($filelist, "r") or die("Unable to open file!");
    $filenames = array();
    while(!feof($file)) {
        array_push($filenames, (string)fgets($file));
    }
    fclose($file);

    $imageFolder = "images/";
    $postFolder = "../posts/";
    $main_element = "";

    $index = 0;
    $NUMBER_OF_COLORS = 5;
    foreach ($filenames as $filename) {
        $filepath = $postFolder . $filename;
        echo getcwd();
        echo "<br>" . $filepath . "<br>";
        chdir($postFolder);
        echo getcwd();
        echo "<br>";
        foreach (glob("*") as $file) {
            if($file == '.' || $file == '..') continue;
            echo $file . '<br>';
        }
        // echo $filepath;
        if (file_exists($filename)) {
            echo "<br>Exists<br>";
        }
        else {
            echo "<br>Does not exist<br>";
        }
        echo getcwd();
        echo "<br>";
        require $filename;
        echo parseMD($filename);
        // $blogEntryFile = fopen($filepath, "r") or die("Unable to open file!");
        // $blogEntry = fread($blogEntryFile, filesize($filepath));
        // fclose($blogEntryFile);
        $date = explode(".", $filename);

        $thisColor = $index % $NUMBER_OF_COLORS;
        $classDescription = "'card color" . $thisColor . "padded margins'";

        $entry = "<section id='" . $date . "' class=" . $classDescription . ">";
        
        $imageURL = $imageFolder . $date . ".jpeg";
        $fullImageURL = $imageFolder . $date . "_full.jpeg";
        $entry = $entry . file_exists($imageURL) . file_exists($fullImageURL) . "</section>";
        $main_element = $main_element . $entry;

        // checkImageExists(imageURL, function(imageExists) {
        //     if (imageExists) {
        //         var post = `<div id="${blogPost.date}-text" class="twothirds">${blogPost.entry}</div>`;
        //         checkImageExists(fullImageURL, function(fullImageExists) {
        //             if (fullImageExists) {
        //                 var image = `<div id="${blogPost.date}-image" class="onethird centred"><a href="${fullImageURL}"><img src=${imageURL} decoding="async" loading="lazy"></a></div>`;
        //                 // Alternate which side the image is on.
        //                 if (index%2) { entry.innerHTML = post + image; }
        //                 else { entry.innerHTML = image + post; }
        //             } else {
        //               // The full resolution of the image doesn't exist
        //                 var image = `<div id="${blogPost.date}-image" class="onethird horizontal"><img src=${imageURL} decoding="async" loading="lazy"></div>`;
        //                 // Alternate which side the image is on.
        //                 if (index%2) { entry.innerHTML = post + image; }
        //                 else { entry.innerHTML = image + post; }
        //             }
        //           });

        //     } else {
        //         // No image exists for this blog post.
        //         entry.innerHTML = `<div id="${blogPost.date}-text">${blogPost.entry}</div>`;
        //     }
        //   });
        // main_element.appendChild(entry);
    }
}

?>