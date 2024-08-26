<script>
  import { afterUpdate, onMount } from "svelte";
  import data from "../data.json";
  import Fuse from "fuse.js";
  import Image from "./Image.svelte";
  import config from "../site.config";
  import _ from "lodash";

  // data.forEach(d => {
  //   if (d.status) {
  //     let l = d.status.split("<br>");
  //     l = l.map((v) => {
  //       var s = v.split(";")
  //       return (s.length == 2) ? `${s[1]};${s[0]}` : s[0];
  //     })

  //     d.status = l;
  //   }
  // })

  // console.log(JSON.stringify(data))

  /**
   * @type {HTMLElement}
   */
  let header;

  /**
   * @type {HTMLElement}
   */
  let body;

  let _data = [];
  let filteredData = [];
  let searchQuery = "";
  let bodyHeight = 0;

  let tableWrapper;
  let verticalImage;
  let overlayImage;
  let duplicateHeader;
  let searchInput;
  let searchBox;
  let scriptLabels = [];
  let stickyLabel;
  let currentLabel = "";

  /**
   * @type {HTMLElement}
   */
  let searchbar;
  let offsetY = 0;
  let offsetYWithHeader = 0;
  let offsetLeft = 0;

  const options = {
    keys: [
      {
        name: "script",
        weight: 2,
      },
      "orthography",
      "languages",
      "location",
      "status",
    ],
    shouldSort: false,
    threshold: 0.2,
  };
  const fuse = new Fuse(data, options);

  const ro = new ResizeObserver((entries) => {
    const elem = entries[0];
    const cr = elem.contentRect;
    bodyHeight = cr.height;

    if (searchbar) {
      offsetLeft = searchbar.getBoundingClientRect().x;
    }
  });

  function performSearch() {
    filteredData = searchQuery == "" ? _data : fuse.search(searchQuery);
  }

  /**
   * @param {string} text
   */
  function renderTextWithLink(text) {
    let newText = [];

    if (!Array.isArray(text)) {
      text = [text];
    }

    text.forEach((val) => {
      var split = val.split(";");
      if (split.length == 2) {
        newText.push(`<a class="font-semibold underline" href="${split[1]}" target="_blank">${split[0]}</a>`);
      } else {
        newText.push(split[0]);
      }
    });

    return newText.join("<br>");
  }

  onMount(() => {
    _data = data.map((value, index) => {
      return {
        item: value,
      };
    });

    performSearch();
    ro.observe(body);

    offsetY = document.getElementById("main-nav").offsetHeight;
    offsetYWithHeader = offsetY + header.getBoundingClientRect().height;

    tableWrapper.addEventListener("scroll", function (event) {
      const target = event.target;
      if (duplicateHeader) {
        duplicateHeader.style.left = offsetLeft - target.scrollLeft + 4 + "px";
      }
    });

    // let actualSearchBox
    // searchBox.classList.remove("hidden");
    // document.querySelector("#main-nav .container").appendChild(searchBox);
    searchbar.style.minHeight = searchBox.clientHeight + "px";
    searchbar.appendChild(searchBox);

    document.getElementById("main-table").addEventListener("mouseover", function (event) {
      /**
       * @type {HTMLElement}
       */
      const target = event.target;
      if (target.tagName == "IMG" && target.parentElement.classList.contains("is-vertical")) {
        verticalImage = target;
        overlayImage = document.createElement("img");
        overlayImage.classList = "img-overlay has-filter absolute shadow-lg shadow-zinc-300";
        overlayImage.src = verticalImage.src;
        overlayImage.style.width = verticalImage.getBoundingClientRect().width + "px";
        overlayImage.style.left = verticalImage.getBoundingClientRect().x + "px";
        overlayImage.style.top = window.scrollY + verticalImage.getBoundingClientRect().y + "px";
        overlayImage.style.zIndex = 40;

        document.body.appendChild(overlayImage);

        const offset = overlayImage.getBoundingClientRect().top + verticalImage.height - window.innerHeight;
        const outViewport = offset > 1;

        if (outViewport) {
          overlayImage.style.transform = `translateY(-${offset + 25}px)`;
        }
      }
    });

    document.body.addEventListener("mouseout", function (event) {
      const target = event.target;
      if (target.tagName == "IMG" && target.classList.contains("img-overlay")) {
        const overlays = document.querySelectorAll(".img-overlay");
        overlayImage = null;
        overlays.forEach((elem) => {
          elem.remove();
        });
      }
    });

    document.addEventListener("keydown", function (event) {
      // Check for Ctrl + K on Windows/Linux and Cmd + K on macOS
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      // Check if the "K" key is pressed
      if (isCtrlOrCmd && event.key.toLowerCase() === "k") {
        event.preventDefault(); // Prevent the default action (e.g., opening links)

        // Focus on the input field
        if (searchInput) {
          searchInput.focus();
        }
      }

      if (event.key === "Escape") {
        if (searchInput && document.activeElement === searchInput) {
          if (searchQuery == "") {
            searchInput.blur();
          }

          searchQuery = "";
        }
      }
    });

    window.addEventListener("scroll", function () {
      const cr = header.getBoundingClientRect();

      if (cr.top < offsetY && !duplicateHeader) {
        document.querySelector("#main-nav .container").appendChild(searchBox);

        const row = header.children[0];
        duplicateHeader = header.cloneNode(true);
        duplicateHeader.classList = "sticky-header table-header-group bg-[#fcfcfc] fixed";
        duplicateHeader.style.top = offsetY + "px";
        duplicateHeader.style.left = offsetLeft - tableWrapper.scrollLeft + 4 + "px";
        duplicateHeader.style.width = row.getBoundingClientRect().width + "px";
        duplicateHeader.style.zIndex = 90;

        duplicateHeader.children[0].style.height = row.getBoundingClientRect().height + "px";

        // floatingSearch.style.bottom = "1.5rem";

        Array.from(row.children).forEach((child, index) => {
          const cell = duplicateHeader.children[0].children[index];
          cell.style.verticalAlign = "middle";
          cell.style.width = child.getBoundingClientRect().width + "px";
        })

        document.body.appendChild(duplicateHeader);

        document.getElementById("scrolltop").classList.toggle("opacity-0");
        document.getElementById("scrolltop").classList.toggle("opacity-100");
        document.getElementById("scrolltop").classList.toggle("rotate-180");
        document.getElementById("scrolltop").classList.toggle("rotate-0");
      } else {
        if (duplicateHeader && cr.top > offsetY) {
          currentLabel = "";
          duplicateHeader.remove();
          duplicateHeader = null;

          searchbar.appendChild(searchBox);

          document.getElementById("scrolltop").classList.toggle("opacity-0");
          document.getElementById("scrolltop").classList.toggle("opacity-100");
          document.getElementById("scrolltop").classList.toggle("rotate-180");
          document.getElementById("scrolltop").classList.toggle("rotate-0");
        }
      }

      // checkStickyLabel();
    });

    // filteredData = _.sortBy(filteredData, ['item.status'])
  });

  function checkStickyLabel() {
    let theLabel;
    
    scriptLabels.forEach(label => {
      if (label.getBoundingClientRect().top < offsetYWithHeader - label.parentElement.offsetHeight) {
        console.log(label)
        theLabel = label;
        return;
      }
    });

    if (theLabel && theLabel.innerHTML != currentLabel) {
      if (theLabel) {
        // theLabel.classList.toggle("opacity-0");
        currentLabel = theLabel.innerHTML;
        console.log(currentLabel)
        stickyLabel.style.top = offsetYWithHeader + theLabel.getBoundingClientRect().height + "px";
      }
    }
  }

  afterUpdate(() => {
    scriptLabels = scriptLabels.filter(label => !!label);

    const innerTableScroll = tableWrapper.children[0];
    const scrollPosition = innerTableScroll.offsetLeft - (tableWrapper.clientWidth / 2) + (innerTableScroll.offsetWidth / 2);

    if (innerTableScroll.offsetWidth < document.body.clientWidth) {
      tableWrapper.style.overflowX = "hidden";
    } else {
      tableWrapper.style.overflowX = "";
    }

    if (document.body.clientWidth <= 1024) {
      tableWrapper.scrollLeft = 0;
    } else {
      tableWrapper.scrollLeft = scrollPosition;
    }

    if (header && duplicateHeader) {
      const row = header.children[0];
      Array.from(row.children).forEach((child, index) => {
        const cell = duplicateHeader.children[0].children[index];
        cell.style.verticalAlign = "middle";
        cell.style.width = child.getBoundingClientRect().width + "px";
      })
    }
  })

  // searchQuery = "lik tai"
  $: searchQuery, performSearch();
</script>

<section bind:this={searchbar} class="flex flex-row gap-4 items-center my-8">
</section>

<section class="pb-10" style="height: {bodyHeight}px">
  <div bind:this={tableWrapper} id="table-wrapper" class="overflow-x-scroll absolute left-0 no-scrollbar w-full" style="padding: 0 {offsetLeft}px;">
    <div class="min-w-full w-fit border-[3pt] border-[rgb(235,227,224)] shadow-lg shadow-zinc-300 mb-10">
      <div bind:this={body} id="main-table" class="table bg-[#f8f8f8] w-full border-collapse">
        <div bind:this={header} class="table-header-group bg-[#fcfcfc] z-50 sticky mt-10">
          <div class="table-row font-bold [&>.table-cell]:border-b-4 [&>.table-cell]:border-b-amber-900">
            <div class="table-cell relative">
              Script
            </div>
            <div class="table-cell">Orthography</div>
            <div class="table-cell">Languages</div>
            <div class="table-cell">Location</div>
            <div class="table-cell">Image</div>
            <div class="table-cell text-nowrap">Unicode Status</div>
            <div class="table-cell">Links</div>
            <div class="table-cell">Note</div>
          </div>
        </div>
        <div id="table-body" class="table-row-group [&>.table-row:last-child>.table-cell]:!border-b-0">
          {#each filteredData as { item }, index}
            <div class="table-row group hover:bg-zinc-100">
              <!-- {#if !labelDisplay.includes(item.script)} -->
              {#if index == 0 || filteredData[index-1].item.script != item.script}
                <div class="table-cell script-cell font-bold relative min-w-[10ch]">
                    <span bind:this={scriptLabels[index]}>{@html item.script}</span>
                </div>
              {:else}
                <div class="table-cell script-cell font-bold !border-t-0 relative min-w-[10ch]">
                  <span class="select-none opacity-0 group-hover:opacity-30">{@html item.script}</span>
                </div>
              {/if}

              <!-- <div class="table-cell">
                {@html item.orthography}
              </div> -->

              {#if index == 0 || (filteredData[index-1].item.orthography != item.orthography) || item.orthography == ""}
                <div class="table-cell script-cell !border-b-0 relative">
                    <span>{@html item.orthography}</span>
                </div>
              {:else}
                <div class="table-cell script-cell relative !border-t-0">
                  <span class="select-none opacity-0 group-hover:opacity-30">{@html item.orthography}</span>
                </div>
              {/if}

              <div class="table-cell">
                {@html item.languages}
              </div>
              <div class="table-cell">
                {@html item.location}
              </div>
              <div class="table-cell">
                {#key item.image}
                  {#if item.image}
                    <Image src={config.base + "/images/" + item.image} alt={item.script + "-" + item.orthography} />
                  {/if}
                {/key}
              </div>
              <div class="table-cell">
                {@html renderTextWithLink(item.status)}
              </div>
              <div class="table-cell text-balance">
                {@html renderTextWithLink(item.links)}
              </div>
              <div class="table-cell text-balance min-w-[24ch]">
                {@html item.note || "&nbsp;"}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</section>

<div bind:this={searchBox}>
  <div class="flex flex-row gap-4 rounded-lg items-center">
    <label for="base-input" class="block font-semibold">Search:</label>
    <input bind:value={searchQuery} bind:this={searchInput} autocomplete="off" type="text" id="base-input" placeholder="(Cmd/Ctrl + K)" class="text-black bg-gray-50 border border-gray-500 rounded-md focus:ring-blue-500 focus:border-blue-500 block max-w-64 py-1 px-2" />
  </div>
</div>

<div bind:this={stickyLabel} class="sticky-label fixed ml-[calc(1.5rem+4px)] font-bold bg-[#f8f8f8]">
  {@html currentLabel}
</div>