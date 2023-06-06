<nav id="navbar" class="nav-bar">
    <a  customdeck-update-relpath href=""><h4 customdeck-placeholder="site.title" class="site-title"><?php echo $config["site"]["title"] ?></h4></a>
    <ul class="nav-bar-ul">
        <li class="nav-bar-item">
            <a id="home" <?php if($PAGE == "home") {echo "class='active'";} ?> customdeck-update-relpath href="">Home</a>
        </li>
        <li class="nav-bar-item">
            <a id="blog" <?php if($PAGE == "blog") {echo "class='active'";} ?> customdeck-update-relpath href="blog/">Blog</a>
        </li>
        <li class="nav-bar-item">
            <a id="podcast" <?php if($PAGE == "podcast") {echo "class='active'";} ?> customdeck-update-relpath href="podcast/">Podcast</a>
        </li>
    </ul>
</nav>

<nav id="dropdown" class="dropdown">
    <a href=""><h4 customdeck-placeholder="site.title"  class="site-title"></h4></a>
    <button class="dropbtn" onclick="dropMenuClick()">Menu</button>  
    <div class="dropdown-content" id="myDropdown">
        <a id="home-drop" <?php if($PAGE == "home") {echo "class='active'";} ?> customdeck-update-relpath href="">Home</a>
        <a id="blog-drop" <?php if($PAGE == "blog") {echo "class='active'";} ?> customdeck-update-relpath href="blog/">Blog</a>
        <a id="podcast-drop" <?php if($PAGE == "podcast") {echo "class='active'";} ?> customdeck-update-relpath href="podcast/">Podcast</a>
    </div>
</nav> 

<span><img class="scene" alt="Scene Mode" id="scene" onclick="changeScene()"></span>